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
	label?: FileUploadInputChildren['label'];
}

export interface FileUploaderProperties extends FileUploadInputProperties {
	/** Custom validator used to validate each file */
	customValidator?: (file: File) => ValidationInfo | void;

	/** The files to render in the widget (controlled scenario) */
	files?: File[];

	/** The maximum size in bytes of a file */
	maxSize?: number;

	/** Callback fired when the input validation changes */
	onValidate?: (valid: boolean | undefined, message: string) => void;

	/** Show the file size in the file list. Default is `true` */
	showFileSize?: boolean;

	/** Represents if all files are valid (controlled scenario) */
	valid?: { valid?: boolean; message?: string } | boolean;
}

const factorNames = ['', 'B', 'KB', 'MB', 'GB', 'TB', 'PB'];
function formatBytes(byteCount: number) {
	let formattedValue = '';
	for (let i = 1; i < factorNames.length; i++) {
		if (byteCount < Math.pow(1024, i) || i === factorNames.length - 1) {
			formattedValue = `${(byteCount / Math.pow(1024, i - 1)).toFixed(2)} ${factorNames[i]}`;
			break;
		}
	}

	return formattedValue;
}

interface ValidationProps {
	file: File;
	maxSize?: number;
	messages: typeof bundle;
}

function validateFile(props: ValidationProps): ValidationInfo {
	const {
		file,
		maxSize,
		messages: { messages }
	} = props;
	let valid = true;
	let message = '';

	if (maxSize) {
		if (file.size > maxSize) {
			valid = false;
			message = messages.invalidFileSize;
		}
	}

	return {
		message,
		valid
	};
}

export interface FileUploaderIcache {
	files: File[];
	previousInitialFiles?: File[];
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
		onValue,
		required = false,
		showFileSize = true
	} = properties();
	const { messages } = i18n.localize(bundle);
	const themeCss = theme.classes(css);
	const inputChild = (children()[0] || {}) as FileUploadInputChildren;
	const previousInitialFiles = icache.get('previousInitialFiles');
	let files =
		initialFiles && initialFiles !== previousInitialFiles
			? initialFiles
			: icache.getOrSet('files', []);
	icache.set('previousInitialFiles', initialFiles);

	function onInputValue(newFiles: File[]) {
		const newValue = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
		icache.set('files', newValue);
		onValue(newValue);
	}

	function remove(file: File) {
		const files = icache.get('files');
		/* istanbul ignore if */
		if (!files) {
			// type-safety check; should never happen
			return;
		}

		const fileIndex = files.indexOf(file);
		/* istanbul ignore if */
		if (fileIndex === -1) {
			// type-safety check; should never happen
			return;
		} else {
			const updatedFiles = [...files];
			updatedFiles.splice(fileIndex, 1);
			icache.set('files', updatedFiles);
			onValue(updatedFiles);
		}
	}

	function renderFiles() {
		return files.map(function(file) {
			let validationInfo: ValidationInfo | void = validateFile({
				file,
				maxSize,
				messages: { messages }
			});

			if (validationInfo && validationInfo.valid && customValidator) {
				validationInfo = customValidator(file);
			}
			const isValid = validationInfo ? validationInfo.valid : true;

			return (
				<div classes={[themeCss.fileItem, !isValid && themeCss.invalid]} key={file.name}>
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
					{validationInfo && validationInfo.message && (
						<div classes={[themeCss.validationMessage]}>{validationInfo.message}</div>
					)}
				</div>
			);
		});
	}

	inputChild.content = files.length ? [<div key="fileList">{renderFiles()}</div>] : null;

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
