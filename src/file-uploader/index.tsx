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

export interface FileItemRendererProps {
	files: File[];
	messages: typeof bundle;
	remove(file: File): void;
	themeCss: typeof css;
}

export interface FileUploaderIcache {
	files: File[];
}

export interface FileUploaderProperties extends FileUploadInputProperties {}

function renderFiles(props: FileItemRendererProps) {
	const {
		files,
		messages: { messages },
		remove,
		themeCss
	} = props;

	return files.map(function(file) {
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
		disabled = false,
		multiple = false,
		name,
		required = false
	} = properties();
	const { messages } = i18n.localize(bundle);
	const files = icache.getOrSet('files', []);
	const themeCss = theme.classes(css);

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
		<div classes={[themeCss.root, disabled && themeCss.disabled]}>
			<FileUploadInput
				accept={accept}
				allowDnd={allowDnd}
				disabled={disabled}
				multiple={multiple}
				name={name}
				onValue={onValue}
				required={required}
			>
				{children()[0]}
			</FileUploadInput>

			<div>{renderFiles({ files, messages: { messages }, remove, themeCss })}</div>
		</div>
	);
});

export default FileUploader;
