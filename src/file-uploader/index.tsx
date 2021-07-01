import { RenderResult } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import {
	FileUploadInput,
	FileUploadInputChildren,
	FileUploadInputProperties,
	ValidationInfo
} from '../file-upload-input';
import { Icon } from '../icon';
import theme from '../middleware/theme';
import bundle from './nls/FileUploader';

import * as css from '../theme/default/file-uploader.m.css';
import * as fileUploadInputCss from '../theme/default/file-upload-input.m.css';
import * as fileUploadInputFixedCss from '../file-upload-input/styles/file-upload-input.m.css';

export interface FileUploaderChildren {
	label?: RenderResult;
}

export interface FileUploaderProperties extends FileUploadInputProperties {
	/** Custom validator used to validate each file */
	customValidator?: (file: File) => ValidationInfo | void;

	/** The files to render in the widget (controlled scenario) */
	files?: FileWithValidation[];

	/**
	 * The maximum size in bytes of a file. Files larger than this will be included in the file list but their
	 * `valid` property will be `false` and their `message` property will be set to the validation message.
	 */
	maxSize?: number;

	/**
	 * Callback fired when the input validation changes. The `valid` parameter is an aggregate of the `valid` value
	 * of all files. The `message` parameter is empty; each file has a `message` property.
	 */
	onValidate?: (valid: boolean | undefined, message: string) => void;

	/** Callback called when the user selects files */
	onValue(value: FileWithValidation[]): void;

	/** Show the file size in the file list. Default is `true` */
	showFileSize?: boolean;
}

export type FileWithValidation = File & ValidationInfo;

const factorNames = ['', 'B', 'KB', 'MB', 'GB', 'TB', 'PB'];
export function formatBytes(byteCount: number) {
	if (isNaN(byteCount)) {
		return '';
	}

	let formattedValue = '';
	for (let i = 1; i < factorNames.length; i++) {
		if (byteCount < Math.pow(1024, i) || i === factorNames.length - 1) {
			formattedValue = `${(byteCount / Math.pow(1024, i - 1)).toFixed(i > 1 ? 2 : 0)} ${
				factorNames[i]
			}`;
			// values below the next factor up but greater than 1023.99 will round up to 1024.00 - push them down
			if (formattedValue.startsWith('1024.00') && i < factorNames.length - 1) {
				formattedValue = `1023.99 ${factorNames[i]}`;
			}
			break;
		}
	}

	return formattedValue;
}

export interface FileUploaderIcache {
	previousValidationState?: boolean;
	value: FileWithValidation[];
}

const icache = createICacheMiddleware<FileUploaderIcache>();
const factory = create({ i18n, icache, theme })
	.properties<FileUploaderProperties>()
	.children<FileUploaderChildren | undefined>();

export const FileUploader = factory(function FileUploader({
	children,
	middleware: { i18n, icache, theme },
	properties
}) {
	const {
		accept,
		allowDnd = true,
		customValidator,
		disabled = false,
		files: initialFiles,
		maxSize,
		multiple = false,
		name,
		onValidate,
		onValue,
		required = false,
		showFileSize = true
	} = properties();
	const { messages } = i18n.localize(bundle);
	const themeCss = theme.classes(css);
	const inputChild = (children()[0] || {}) as FileUploadInputChildren;
	let files = initialFiles || icache.getOrSet('value', []);

	function validateFiles(files: Array<File | FileWithValidation>): FileWithValidation[] {
		const previousValidationState = icache.get('previousValidationState');
		let currentValidationState = true;

		const validatedFiles = files.map(function(file) {
			const validatedFile: FileWithValidation = file;
			let message = '';
			let valid = maxSize ? file.size <= maxSize : true;

			if (valid) {
				if (customValidator) {
					const customValid = customValidator(file);
					if (customValid) {
						valid = customValid.valid !== false;
						message = customValid.message || '';
					}
				}
			} else {
				message = messages.invalidFileSize;
			}

			currentValidationState = currentValidationState && valid;

			// It is important to use the original File object - creating a new object and assigning file's
			// properties to it won't work for File's special methods. Even setting the File instance as the
			// prototype of another object will result in failure when attempting to invoke File methods.
			validatedFile.valid = valid;
			validatedFile.message = message;

			return validatedFile;
		});

		if (currentValidationState !== previousValidationState) {
			onValidate && onValidate(currentValidationState, '');
		}

		return validatedFiles;
	}

	function updateFiles(newFiles: Array<File | FileWithValidation>) {
		const validatedFiles = validateFiles(newFiles);
		// only update the cache if the widget is not controlled
		if (!initialFiles) {
			icache.set('value', validatedFiles);
		}
		onValue(validatedFiles);
	}

	function onInputValue(newFiles: File[]) {
		const newValue = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
		updateFiles(newValue);
	}

	function remove(file: FileWithValidation) {
		const fileIndex = files.indexOf(file);
		/* istanbul ignore if (type-safety check; should never happen) */
		if (fileIndex === -1) {
			return;
		} else {
			const updatedFiles = [...files];
			updatedFiles.splice(fileIndex, 1);
			updateFiles(updatedFiles);
		}
	}

	function renderFiles(files: FileWithValidation[]) {
		return files.map(function(file) {
			let validationInfo: ValidationInfo;
			if ('valid' in file) {
				validationInfo = {
					valid: file.valid,
					message: file.message
				};
			} else {
				validationInfo = {
					valid: true,
					message: ''
				};
			}

			const { message, valid } = validationInfo;

			return (
				<div
					classes={[themeCss.fileItem, valid === false && themeCss.invalid]}
					key={file.name}
				>
					<div classes={[themeCss.fileInfo]}>
						<div classes={[themeCss.fileItemName]}>{file.name}</div>
						{showFileSize && (
							<div classes={[themeCss.fileItemSize]}>{formatBytes(file.size)}</div>
						)}
						<button
							classes={[themeCss.closeButton]}
							onclick={function() {
								remove(file);
							}}
						>
							<Icon type="closeIcon" altText={messages.remove} />
						</button>
					</div>
					{message && <div classes={[themeCss.validationMessage]}>{message}</div>}
				</div>
			);
		});
	}

	inputChild.content = files.length ? [<div key="fileList">{renderFiles(files)}</div>] : null;

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				fileUploadInputFixedCss.root,
				themeCss.root,
				disabled && themeCss.disabled
			]}
		>
			<FileUploadInput
				accept={accept}
				allowDnd={allowDnd}
				disabled={disabled}
				multiple={multiple}
				name={name}
				onValue={onInputValue}
				required={required}
				theme={theme.compose(
					fileUploadInputCss,
					css,
					'input'
				)}
			>
				{inputChild}
			</FileUploadInput>
		</div>
	);
});

export default FileUploader;
