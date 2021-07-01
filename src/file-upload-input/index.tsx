import { DojoEvent, RenderResult } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { create, node, tsx } from '@dojo/framework/core/vdom';
import { Button } from '../button';
import { formatAriaProperties } from '../common/util';
import { Label } from '../label';
import theme from '../middleware/theme';
import bundle from './nls/FileUploadInput';

import * as css from '../theme/default/file-upload-input.m.css';
import * as baseCss from '../theme/default/base.m.css';
import * as buttonCss from '../theme/default/button.m.css';
import * as labelCss from '../theme/default/label.m.css';

export interface FileValidation {
	message?: string;
	valid?: boolean;
}

export interface FileUploadInputChildren {
	/** Label displayed above the input */
	label?: RenderResult;

	/** Content rendered within the upload area */
	content?: RenderResult;
}

export interface FileUploadInputProperties {
	/** Determines what file types this input accepts */
	accept?: string;

	/** Custom aria attributes */
	aria?: { [key: string]: string | null };

	/** Determines if this input is disabled */
	disabled?: boolean;

	/** Hides the label for a11y purposes */
	labelHidden?: boolean;

	/** Allows multiple files to be uploaded at once */
	multiple?: boolean;

	/** Name given to this attribute within a form */
	name?: string;

	/** Callback called when the user selects files */
	onValue(value: File[]): void;

	/** Determines if a value is required for this input */
	required?: boolean;

	/** Represents if the selected files passed internal validation */
	valid?: boolean | FileValidation;
}

const factory = create({ i18n, node, theme })
	.properties<FileUploadInputProperties>()
	.children<FileUploadInputChildren | undefined>();

export const FileUploadInput = factory(function FileUploadInput({
	children,
	id,
	middleware: { i18n, node, theme },
	properties
}) {
	const {
		accept,
		aria = {},
		disabled = false,
		labelHidden = false,
		multiple = false,
		name,
		onValue,
		required = false,
		valid = true
	} = properties();

	const { messages } = i18n.localize(bundle);
	const themeCss = theme.classes(css);
	const { content = undefined, label = undefined } = children()[0] || {};

	function clickNativeButton() {
		// Certain browsers such as Firefox 80 require direct DOM access for fileInputNode.click() to fire.
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
			aria-disabled={disabled ? 'true' : 'false'}
			classes={[theme.variant(), themeCss.root, disabled && themeCss.disabled]}
		>
			{label && (
				<Label
					disabled={disabled}
					forId={`${id}-input-label`}
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
					accept={accept}
					aria-hidden="true"
					classes={[baseCss.hidden]}
					disabled={disabled}
					key="nativeInput"
					multiple={multiple}
					name={name}
					onchange={onChange}
					required={required}
					type="file"
				/>
				<Button
					disabled={disabled}
					onClick={clickNativeButton}
					theme={theme.compose(
						buttonCss,
						css,
						'button'
					)}
				>
					{messages.chooseFiles}
				</Button>
			</div>

			{content}
		</div>
	);
});

export default FileUploadInput;
