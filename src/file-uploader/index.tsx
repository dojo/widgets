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
import fileDrop from '../middleware/fileDrop';
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

	/** The maximum size in bytes of a file */
	maxSize?: number;

	/** Callback fired when the input validation changes */
	onValidate?: (valid: boolean | undefined, message: string) => void;

	/** Show the file size in the file list. Default is `true` */
	showSize?: boolean;
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

type FileItemRendererProps = Pick<
	FileUploaderProperties,
	'customValidator' | 'maxSize' | 'showSize'
> & {
	files: File[];
	messages: typeof bundle;
	remove(file: File): void;
	themeCss: typeof css;
};

function renderFiles(props: FileItemRendererProps) {
	const {
		customValidator,
		files,
		maxSize,
		messages: { messages },
		remove,
		showSize = true,
		themeCss
	} = props;

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
					{showSize && (
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

export interface FileUploaderIcache {
	files: File[];
}
const icache = createICacheMiddleware<FileUploaderIcache>();

const factory = create({ fileDrop, i18n, icache, theme })
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
		maxSize,
		multiple = false,
		name,
		onValue,
		required = false,
		showSize = true
	} = properties();
	const { messages } = i18n.localize(bundle);
	const themeCss = theme.classes(css);
	let files = icache.getOrSet('files', []);
	const inputChild = (children()[0] || {}) as FileUploadInputChildren;

	function onInputValue(newFiles: File[]) {
		const newValue = multiple ? [...files, ...newFiles] : newFiles.slice(0, 1);
		icache.set('files', newValue);
		onValue && onValue(newValue);
	}

	function remove(file: File) {
		const fileIndex = files.indexOf(file);
		if (fileIndex !== -1) {
			files.splice(fileIndex, 1);
			icache.set('files', files);
			onValue && onValue(files);
		}
	}

	if (files.length) {
		inputChild.content = (
			<div key="fileList">
				{function() {
					return renderFiles({
						customValidator,
						files,
						maxSize,
						messages: { messages },
						remove,
						showSize,
						themeCss
					});
				}}
			</div>
		);
	}

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
