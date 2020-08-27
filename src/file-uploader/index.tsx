import { DojoEvent, RenderResult } from '@dojo/framework/core/interfaces';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import { Icon } from '../icon';
import theme from '../middleware/theme';
import bundle from './nls/FileUploader';

import * as css from '../theme/default/file-uploader.m.css';
import * as baseCss from '../theme/default/base.m.css';
import * as buttonCss from '../theme/default/button.m.css';

export interface FileItemRendererProps {
	files: File[];
	messages: typeof bundle;
	remove(file: File): void;
	themeCss: typeof css;
}

export interface FileItemRenderer {
	(props: FileItemRendererProps): RenderResult;
}

export interface FileUploaderIcache {
	files: File[];
}

export interface FileUploaderChildren {
	buttonLabel?: string;
	dndLabel?: string;
	renderFiles?: FileItemRenderer;
}

export interface FileUploaderProperties {
	accept?: string | string[];
	allowDnd?: boolean;
	disabled?: boolean;
	multiple?: boolean;
	name?: string;
	onValue?(value: File[]): void;
	required?: boolean;
}

function defaultFileRenderer(props: FileItemRendererProps) {
	// TODO: is this the best way to pass values to a child renderer?
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
	.children<FileUploaderChildren | undefined>();

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
	const {
		buttonLabel = messages.chooseFiles,
		dndLabel = messages.orDropFilesHere,
		renderFiles = defaultFileRenderer
	} = children()[0] || {};
	const files = icache.getOrSet('files', []);
	const themeCss = theme.classes(css);
	const buttonThemeCss = theme.classes(buttonCss);

	function onChange(event: DojoEvent<HTMLInputElement>) {
		const newlyAddedFiles = Array.from(event.target.files || []);
		if (multiple) {
			icache.set('files', [...files, ...newlyAddedFiles]);
		} else {
			icache.set('files', Array.from(event.target.files || []));
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
			<div>
				{/* TODO: is a button-styled label the best approach? */}
				<label
					classes={[
						theme.variant(),
						buttonThemeCss.root,
						disabled ? buttonThemeCss.disabled : null,
						themeCss.button
					]}
				>
					{buttonLabel}
					<input
						accept={accept}
						classes={[baseCss.hidden]}
						disabled={disabled}
						multiple={multiple}
						name={name}
						onchange={onChange}
						required={required}
						type="file"
					/>
				</label>
				{allowDnd && dndLabel}
			</div>
			<div>{renderFiles({ files, messages: { messages }, remove, themeCss })}</div>
		</div>
	);
});

export default FileUploader;
