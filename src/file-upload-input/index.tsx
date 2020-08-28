import { DojoEvent } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { create, node, tsx } from '@dojo/framework/core/vdom';
import { Button } from '../button';
import theme from '../middleware/theme';
import bundle from './nls/FileUploadInput';

import * as css from '../theme/default/file-upload-input.m.css';
import * as baseCss from '../theme/default/base.m.css';

export interface FileUploaderChildren {
	buttonLabel?: string;
	dndLabel?: string;
}

export interface FileUploaderProperties {
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

const factory = create({ i18n, node, theme })
	.properties<FileUploaderProperties>()
	.children<FileUploaderChildren | undefined>();

export const FileUploadInput = factory(function FileUploader({
	children,
	middleware: { i18n, node, theme },
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

	function onActivate() {
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
		<div classes={[themeCss.root, disabled && themeCss.disabled]}>
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
			<Button disabled={disabled} onClick={onActivate}>
				{buttonLabel}
			</Button>

			{allowDnd && <span classes={[themeCss.dndLabel]}>{dndLabel}</span>}
		</div>
	);
});

export default FileUploadInput;
