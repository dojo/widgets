import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import {
	FileUploadInput,
	FileUploadInputChildren,
	FileUploadInputProperties
} from '../file-upload-input';
import { Icon } from '../icon';
import theme from '../middleware/theme';
import bundle from './nls/FileUploader';

import * as css from '../theme/default/file-uploader.m.css';
import * as baseCss from '../theme/default/base.m.css';
import * as fileUploadInputCss from '../theme/default/file-upload-input.m.css';
import * as fileUploadInputFixedCss from '../file-upload-input/styles/file-upload-input.m.css';

export interface FileUploaderIcache {
	files: File[];
	isDndActive: boolean;
}

export interface FileUploaderProperties extends FileUploadInputProperties {
	/** Custom validator used to validate each file */
	customValidator?: (file: File) => { valid?: boolean; message?: string } | void;

	/** The maximum size in bytes of a file */
	maxSize?: number;
}

export interface FileItemRendererProps {
	customValidator: FileUploaderProperties['customValidator'];
	files: File[];
	maxSize?: number;
	messages: typeof bundle;
	remove(file: File): void;
	themeCss: typeof css;
}

function renderFiles(props: FileItemRendererProps) {
	const {
		// customValidator,
		files,
		// maxSize,
		messages: { messages },
		remove,
		themeCss
	} = props;

	return files.map(function(file) {
		/*
		const isValid = customValidator
			? customValidator(file)
			: maxSize
			? file.size <= maxSize
			: true;*/

		return (
			<div classes={[themeCss.fileItem]} key={file.name}>
				<div classes={[themeCss.fileItemName]}>{file.name}</div>
				<button
					classes={[themeCss.closeButton]}
					onclick={function() {
						remove(file);
					}}
				>
					<Icon type="closeIcon" altText={messages.remove} />
				</button>
			</div>
		);
	});
}

const factory = create({ i18n, icache: createICacheMiddleware<FileUploaderIcache>(), theme })
	.properties<FileUploaderProperties>()
	.children<FileUploadInputChildren | undefined>();

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
		required = false
	} = properties();
	const { messages } = i18n.localize(bundle);
	const files = icache.getOrSet('files', []);
	let isDndActive = false;
	const themeCss = theme.classes(css);
	const fileUploadInputThemeCss = theme.classes(fileUploadInputCss);

	function onValue(newFiles: File[]) {
		if (multiple) {
			icache.set('files', [...files, ...newFiles]);
		} else {
			icache.set('files', newFiles);
		}
	}

	function remove(file: File) {
		const fileIndex = files.indexOf(file);
		if (fileIndex !== -1) {
			files.splice(fileIndex, 1);
			icache.set('files', files);
		}
	}

	return (
		<div
			key="root"
			classes={[
				theme.variant(),
				fileUploadInputFixedCss.root,
				themeCss.root,
				isDndActive && themeCss.dndActive,
				disabled && themeCss.disabled
			]}
		>
			<FileUploadInput
				accept={accept}
				allowDnd={false}
				disabled={disabled}
				multiple={multiple}
				name={name}
				onValue={onValue}
				required={required}
			>
				{children()[0]}
			</FileUploadInput>

			{files.length && (
				<div key="fileList">
					{renderFiles({
						customValidator,
						files,
						maxSize,
						messages: { messages },
						remove,
						themeCss
					})}
				</div>
			)}

			{allowDnd && (
				<div
					key="overlay"
					classes={[
						fileUploadInputFixedCss.dndOverlay,
						fileUploadInputThemeCss.dndOverlay,
						!isDndActive && baseCss.hidden
					]}
				/>
			)}
		</div>
	);
});

export default FileUploader;
