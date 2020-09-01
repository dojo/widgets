import { DojoEvent, RenderResult } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { create, node, tsx } from '@dojo/framework/core/vdom';
import { Button } from '../button';
import fileDrop from '../middleware/fileDrop';
import theme from '../middleware/theme';
import bundle from './nls/FileUploadInput';

import * as css from '../theme/default/file-upload-input.m.css';
import * as baseCss from '../theme/default/base.m.css';
import * as fixedCss from './styles/file-upload-input.m.css';

export interface FileUploadInputChildren {
	buttonLabel?: RenderResult;
	dndLabel?: RenderResult;
}

export interface FileUploadInputProperties {
	/** The `accept` attribute of the input */
	accept?: string | string[];

	/** If `true` file drag-n-drop is allowed. Default is `true` */
	allowDnd?: boolean;

	/** The `disabled` attribute of the input */
	disabled?: boolean;

	/** The `multiple` attribute of the input */
	multiple?: boolean;

	/** The `name` attribute of the input */
	name?: string;

	/** Callback called when the user selects files */
	onValue?(value: File[]): void;

	/** The `required` attribute of the input */
	required?: boolean;
}

const factory = create({ fileDrop, i18n, node, theme })
	.properties<FileUploadInputProperties>()
	.children<FileUploadInputChildren | undefined>();

export const FileUploadInput = factory(function FileUploadInput({
	children,
	middleware: { fileDrop, i18n, node, theme },
	properties
}) {
	const {
		accept,
		allowDnd = true,
		disabled = false,
		multiple = false,
		name,
		onValue,
		required = false
	} = properties();
	const { messages } = i18n.localize(bundle);
	const { buttonLabel = messages.chooseFiles, dndLabel = messages.orDropFilesHere } =
		children()[0] || {};
	const themeCss = theme.classes(css);
	let isDndActive = false;

	if (allowDnd) {
		const dndInfo = fileDrop.get('root', 'overlay');
		isDndActive = dndInfo.isDragging;

		if (dndInfo.isDropped && dndInfo.files && dndInfo.files.length) {
			onValue && onValue(dndInfo.files);
			fileDrop.reset('root', 'overlay');
		}
	}

	function onClickButton() {
		const inputNode = node.get('nativeInput');
		if (inputNode) {
			inputNode.click();
		}
	}

	function onChange(event: DojoEvent<HTMLInputElement>) {
		if (!onValue) {
			return;
		}
		const fileArray = Array.from(event.target.files || []);
		onValue(fileArray);
	}

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				fixedCss.root,
				themeCss.root,
				isDndActive && themeCss.dndActive,
				disabled && themeCss.disabled
			]}
		>
			<input
				key="nativeInput"
				accept={accept}
				aria="hidden"
				classes={[baseCss.hidden]}
				disabled={disabled}
				multiple={multiple}
				name={name}
				onchange={onChange}
				required={required}
				type="file"
			/>
			<Button disabled={disabled} onClick={onClickButton}>
				{buttonLabel}
			</Button>

			{allowDnd && [
				<span classes={[themeCss.dndLabel]}>{dndLabel}</span>,
				<div
					key="overlay"
					classes={[
						fixedCss.dndOverlay,
						themeCss.dndOverlay,
						!isDndActive && baseCss.hidden
					]}
				/>
			]}
		</div>
	);
});

export default FileUploadInput;
