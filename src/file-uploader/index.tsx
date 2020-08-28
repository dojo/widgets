import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import {
	FileUploadInput,
	FileUploadInputChildren,
	FileUploadInputProperties
} from '../file-upload-input';
import { Icon } from '../icon';
// import dnd from '../middleware/dnd';
import theme from '../middleware/theme';
import bundle from './nls/FileUploader';

import * as css from '../theme/default/file-uploader.m.css';
import * as fileUploadInputCss from '../theme/default/file-upload-input.m.css';

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
/*
function stopEvent (event: Event) {
	event.preventDefault();
	event.stopPropagation();
}
*/
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
	const isDndActive = icache.getOrSet('isDndActive', false);
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
	/*
	dnd.onDragEnter('root', function(event) {
		stopEvent(event);
		icache.set('isDndActive', true);
	});

	dnd.onDragLeave('overlay', function(event) {
		stopEvent(event);
		icache.set('isDndActive', false);
	});

	dnd.onDragOver('overlay', function(event) {
		stopEvent(event);
	});

	dnd.onDrop('overlay', function(event) {
		stopEvent(event);
		icache.set('isDndActive', false);

		if (event.dataTransfer && event.dataTransfer.files.length) {
			const newFiles = Array.from(event.dataTransfer.files);
			if (multiple) {
				icache.set('files', [...files, ...newFiles]);
			} else {
				icache.set('files', newFiles.slice(0, 1));
			}
		}
	});
*/
	return (
		<div key="root" classes={[themeCss.root, disabled && themeCss.disabled]}>
			{isDndActive && <div key="overlay" classes={[fileUploadInputThemeCss.dndOverlay]} />}

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
		</div>
	);
});

export default FileUploader;
