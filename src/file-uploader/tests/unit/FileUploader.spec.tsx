import { tsx } from '@dojo/framework/core/vdom';
import { assertion, renderer, wrap } from '@dojo/framework/testing/renderer';
import { noop } from '@dojo/widgets/common/tests/support/test-helpers';
import FileUploader from '../../index';
import FileUploadInput from '../../../file-upload-input';
import Icon from '../../../icon';

import * as css from '../../../theme/default/file-uploader.m.css';
import * as fileUploadInputCss from '../../../theme/default/file-upload-input.m.css';
import * as fileUploadInputFixedCss from '../../../file-upload-input/styles/file-upload-input.m.css';

const { after, afterEach, it, describe } = intern.getInterface('bdd');

describe('FileUploader', function() {
	const WrappedRoot = wrap('div');
	const WrappedFileUploadInput = wrap(FileUploadInput);

	const baseRootProperties = {
		key: 'root',
		classes: [null, fileUploadInputFixedCss.root, css.root, false]
	};
	const baseInputProperties = {
		accept: undefined,
		allowDnd: true,
		disabled: false,
		multiple: false,
		name: undefined,
		onValue: noop,
		required: false,
		theme: {
			'@dojo/widgets/file-upload-input': {
				disabled: fileUploadInputCss.disabled,
				dndActive: fileUploadInputCss.dndActive,
				dndLabel: fileUploadInputCss.dndLabel,
				dndOverlay: fileUploadInputCss.dndOverlay,
				root: fileUploadInputCss.root,
				wrapper: fileUploadInputCss.wrapper
			}
		}
	};

	const baseAssertion = assertion(function() {
		return (
			<WrappedRoot {...baseRootProperties}>
				<WrappedFileUploadInput {...baseInputProperties}>
					{{
						content: null
					}}
				</WrappedFileUploadInput>
			</WrappedRoot>
		);
	});

	it('renders', function() {
		const r = renderer(function() {
			return <FileUploader onValue={noop} />;
		});

		r.expect(baseAssertion);
	});

	it('sets props on FileUploadInput', function() {
		const passthruProps = {
			accept: 'accept',
			allowDnd: false,
			disabled: true,
			multiple: true,
			name: 'name',
			required: true
		};
		const expectedRootClasses = [...baseRootProperties.classes];
		expectedRootClasses.splice(3, 1, css.disabled);

		const r = renderer(function() {
			return <FileUploader {...passthruProps} onValue={noop} />;
		});

		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', expectedRootClasses)
				.setProperties(WrappedFileUploadInput, {
					...baseInputProperties,
					...passthruProps,
					onValue: noop
				})
		);
	});

	it('renders label', function() {
		const label = 'Widget label';

		const r = renderer(function() {
			return (
				<FileUploader onValue={noop}>
					{{
						label
					}}
				</FileUploader>
			);
		});

		r.expect(baseAssertion.setChildren(WrappedFileUploadInput, () => [{ label, content: '' }]));
	});

	it('renders files', function() {
		const files = [
			{
				name: 'file1.jpg',
				size: 55383,
				formattedSize: '54.08 KB',
				type: 'image/jpeg'
			},
			{
				name: 'file2.png',
				size: 180240,
				formattedSize: '176.02 KB',
				type: 'image/png',
				valid: false,
				message: 'File is too big'
			},
			{
				name: 'file3.png',
				size: 4001220,
				formattedSize: '3.82 MB',
				type: 'image/png',
				valid: true,
				message: 'File is great'
			}
		];

		const r = renderer(function() {
			return <FileUploader files={files as any} onValue={noop} />;
		});

		const content = (
			<div key="fileList">
				{files.map(function(file) {
					return (
						<div
							classes={[css.fileItem, file.valid === false ? css.invalid : false]}
							key={file.name}
						>
							<div classes={[css.fileInfo]}>
								<div classes={[css.fileItemName]}>{file.name}</div>
								<div classes={[css.fileItemSize]}>{file.formattedSize}</div>
								<button onclick={noop} classes={[css.closeButton]}>
									<Icon altText="Remove" type="closeIcon" />
								</button>
							</div>
							{file.message && (
								<div classes={[css.validationMessage]}>{file.message}</div>
							)}
						</div>
					);
				})}
			</div>
		);

		r.expect(baseAssertion.setChildren(WrappedFileUploadInput, () => [{ content }]));
	});
});
