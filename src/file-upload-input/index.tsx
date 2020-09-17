import { DojoEvent, RenderResult } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, node, tsx } from '@dojo/framework/core/vdom';
import { Button } from '../button';
import { formatAriaProperties } from '../common/util';
import { Label } from '../label';
import theme from '../middleware/theme';
import bundle from './nls/FileUploadInput';

import * as css from '../theme/default/file-upload-input.m.css';
import * as baseCss from '../theme/default/base.m.css';
import * as buttonCss from '../theme/default/button.m.css';
import * as fixedCss from './styles/file-upload-input.m.css';
import * as labelCss from '../theme/default/label.m.css';

export interface ValidationInfo {
	message?: string;
	valid?: boolean;
}

export interface FileUploadInputChildren {
	/** The label to be displayed above the input */
	label?: RenderResult;

	/**
	 * Content to be rendered within the widget area. This content will be obscured by the overlay during drag and drop.
	 */
	content?: RenderResult;
}

export interface FileUploadInputProperties {
	/** The `accept` attribute of the input */
	accept?: string;

	/** If `true` file drag-n-drop is allowed. Default is `true` */
	allowDnd?: boolean;

	/** Custom aria attributes */
	aria?: { [key: string]: string | null };

	/** The `disabled` attribute of the input */
	disabled?: boolean;

	/** Hides the label for a11y purposes */
	labelHidden?: boolean;

	/** The `multiple` attribute of the input */
	multiple?: boolean;

	/** The `name` attribute of the input */
	name?: string;

	/** Callback called when the user selects files */
	onValue(value: File[]): void;

	/** The `required` attribute of the input */
	required?: boolean;

	/** Represents if the selected files passed validation */
	valid?: boolean | ValidationInfo;

	/** The id to be applied to the input */
	widgetId?: string;
}

/**
 * Filter files based on file types specified by `accept`. This is handled automatically by the OS file selection
 * dialog, but must be done manually for files from drag and drop.
 * @param files
 * @param accept file type specifiers (https://developer.mozilla.org/docs/Web/HTML/Element/input/file#Unique_file_type_specifiers)
 * @returns the files that match a type in `accept`
 */
function filterValidFiles(files: File[], accept: FileUploadInputProperties['accept']) {
	if (!accept) {
		return files;
	}

	const { extensions, types } = accept.split(',').reduce(
		function(sum, acceptPattern) {
			if (acceptPattern.startsWith('.')) {
				sum.extensions.push(new RegExp(`\\${acceptPattern}$`, 'i'));
			} else {
				const wildcardIndex = acceptPattern.indexOf('/*');
				if (wildcardIndex > 0) {
					sum.types.push(
						new RegExp(`^${acceptPattern.substr(0, wildcardIndex)}/.+`, 'i')
					);
				} else {
					sum.types.push(new RegExp(acceptPattern, 'i'));
				}
			}

			return sum;
		},
		{ extensions: [], types: [] } as { extensions: RegExp[]; types: RegExp[] }
	);

	const validFiles = files.filter(function(file) {
		if (
			extensions.some((extensionRegex) => extensionRegex.test(file.name)) ||
			types.some((typeRegex) => typeRegex.test(file.type))
		) {
			return true;
		}
	});

	return validFiles;
}

interface FileUploadInputIcache {
	isDndActive?: boolean;
}
const icache = createICacheMiddleware<FileUploadInputIcache>();

const factory = create({ i18n, icache, node, theme })
	.properties<FileUploadInputProperties>()
	.children<FileUploadInputChildren | undefined>();

export const FileUploadInput = factory(function FileUploadInput({
	children,
	id,
	middleware: { i18n, icache, node, theme },
	properties
}) {
	const {
		accept,
		allowDnd = true,
		aria = {},
		disabled = false,
		labelHidden = false,
		multiple = false,
		name,
		onValue,
		required = false,
		valid = true,
		widgetId = `file-upload-input-${id}`
	} = properties();
	const { messages } = i18n.localize(bundle);
	const themeCss = theme.classes(css);
	const { content = undefined, label = undefined } = children()[0] || {};
	let isDndActive = icache.getOrSet('isDndActive', false);

	// DOM events are used directly because writing reactive middleware for this use-case ends up either very
	// specific and not widely useful, or if attempts are made to provide a general-purpose API the logic becomes
	// very convoluted (especially for dealing with the conditionally rendered overlay).
	// dragenter is listened for on the root node and sets `isDndActive` to `true` at which point
	// the overlay node is displayed
	function onDragEnter(event: DragEvent) {
		event.preventDefault();
		icache.set('isDndActive', true);
	}

	// dragleave is listened for on the overlay since it fires spuriously on the root node
	// as the cursor moves over children
	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		icache.set('isDndActive', false);
	}

	// As long as `event.stopPropagation` is not called drag events will bubble from the overlay
	// to the root node and can be handled there.
	// This event must be handled, but all that needs to be done is prevent the default action:
	// the default action is to cancel the drag operation
	function onDragOver(event: DragEvent) {
		event.preventDefault();
	}

	function onDrop(event: DragEvent) {
		event.preventDefault();
		icache.set('isDndActive', false);

		if (event.dataTransfer && event.dataTransfer.files.length) {
			const fileArray = multiple
				? Array.from(event.dataTransfer.files)
				: [event.dataTransfer.files[0]];
			const validFiles = filterValidFiles(fileArray, accept);
			if (validFiles.length) {
				onValue(validFiles);
			}
		}
	}

	function onClickButton() {
		// It is necessary to get a direct reference to the DOM node for this due to security restrictions some
		// browsers (e.g. Firefox 80) place on `fileInputNode.click()`. The method will only be invoked if the code
		// calling it can directly be traced to a user action. If the call is queued in a scheduler it will not be
		// executed.
		const nativeInputNode = node.get('nativeInput');
		nativeInputNode && nativeInputNode.click();
	}

	function onChange(event: DojoEvent<HTMLInputElement>) {
		if (event.target.files && event.target.files.length) {
			onValue(Array.from(event.target.files));
		}
	}

	return (
		<div
			key="root"
			{...formatAriaProperties(aria)}
			aria-disabled={disabled}
			classes={[
				theme.variant(),
				fixedCss.root,
				themeCss.root,
				isDndActive && themeCss.dndActive,
				disabled && themeCss.disabled
			]}
			ondragenter={allowDnd && disabled === false && onDragEnter}
			ondragover={allowDnd && disabled === false && onDragOver}
			ondrop={allowDnd && disabled === false && onDrop}
		>
			{label && (
				<Label
					disabled={disabled}
					forId={widgetId}
					hidden={labelHidden}
					required={required}
					theme={theme.compose(
						labelCss,
						css,
						'label'
					)}
					valid={typeof valid === 'boolean' ? valid : valid.valid}
				>
					{label}
				</Label>
			)}

			<div classes={[themeCss.wrapper]}>
				<input
					key="nativeInput"
					accept={accept}
					aria-hidden={true}
					classes={[baseCss.hidden]}
					disabled={disabled}
					multiple={multiple}
					name={name}
					onchange={onChange}
					required={required}
					type="file"
				/>
				<Button
					disabled={disabled}
					onClick={onClickButton}
					theme={theme.compose(
						buttonCss,
						css,
						'button'
					)}
				>
					{messages.chooseFiles}
				</Button>

				{allowDnd && <span classes={[themeCss.dndLabel]}>{messages.orDropFilesHere}</span>}
			</div>

			{content}

			{isDndActive && (
				<div
					key="overlay"
					classes={[
						fixedCss.dndOverlay,
						themeCss.dndOverlay,
						!isDndActive && baseCss.hidden
					]}
					ondragleave={allowDnd && onDragLeave}
				/>
			)}
		</div>
	);
});

export default FileUploadInput;
