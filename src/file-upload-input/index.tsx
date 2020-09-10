import { DojoEvent, RenderResult } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
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

export interface FileUploadInputChildren {
	/** The label to be displayed above the input */
	label?: RenderResult;

	/** Content to be rendered within the widget area */
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
	valid?: ValidationInfo | boolean;

	/** The id to be applied to the input */
	widgetId?: string;
}

export function filterValidFiles(files: File[], accept: FileUploadInputProperties['accept']) {
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

export interface ValidationInfo {
	message?: string;
	valid?: boolean;
}

interface FileUploadInputIcache {
	isDndActive?: boolean;
	shouldClick?: boolean;
}
const icache = createICacheMiddleware<FileUploadInputIcache>();

const factory = create({ i18n, icache, theme })
	.properties<FileUploadInputProperties>()
	.children<FileUploadInputChildren | undefined>();

export const FileUploadInput = factory(function FileUploadInput({
	children,
	id,
	middleware: { i18n, icache, theme },
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
	const { content, label } = children()[0] || {};
	let isDndActive = icache.getOrSet('isDndActive', false);

	function onDragEnter(event: DragEvent) {
		event.preventDefault();
		icache.set('isDndActive', true);
	}

	function onDragLeave(event: DragEvent) {
		event.preventDefault();
		icache.set('isDndActive', false);
	}

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
		icache.set('shouldClick', true);
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
					click={function() {
						const shouldClick = Boolean(icache.getOrSet('shouldClick', false));
						shouldClick && icache.set('shouldClick', false, false);
						return shouldClick;
					}}
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
