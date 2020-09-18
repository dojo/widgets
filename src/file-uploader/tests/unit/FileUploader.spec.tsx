import { tsx } from '@dojo/framework/core/vdom';
import { assertion, renderer, wrap } from '@dojo/framework/testing/renderer';
import { noop } from '@dojo/widgets/common/tests/support/test-helpers';
import * as sinon from 'sinon';
import FileUploader, { formatBytes } from '../../index';
import FileUploadInput from '../../../file-upload-input';
import Icon from '../../../icon';

import bundle from '../../nls/FileUploader';
import * as css from '../../../theme/default/file-uploader.m.css';
import * as fileUploadInputCss from '../../../theme/default/file-upload-input.m.css';
import * as fileUploadInputFixedCss from '../../../file-upload-input/styles/file-upload-input.m.css';

const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
const { messages } = bundle;

describe('FileUploader', function() {
	const WrappedRoot = wrap('div');
	const WrappedFileUploadInput = wrap(FileUploadInput);
	const WrappedButton = wrap('button');

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

	function getTestFiles() {
		return [
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
	}

	function getRenderedFiles(files: ReturnType<typeof getTestFiles>) {
		return (
			<div key="fileList">
				{files.map(function(file, index) {
					return (
						<div
							classes={[css.fileItem, file.valid === false ? css.invalid : false]}
							key={file.name}
						>
							<div classes={[css.fileInfo]}>
								<div classes={[css.fileItemName]}>{file.name}</div>
								<div classes={[css.fileItemSize]}>{formatBytes(file.size)}</div>
								{index === 0 ? (
									<WrappedButton onclick={noop} classes={[css.closeButton]}>
										<Icon altText="Remove" type="closeIcon" />
									</WrappedButton>
								) : (
									<button onclick={noop} classes={[css.closeButton]}>
										<Icon altText="Remove" type="closeIcon" />
									</button>
								)}
							</div>
							{file.message && (
								<div classes={[css.validationMessage]}>{file.message}</div>
							)}
						</div>
					);
				})}
			</div>
		);
	}

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

	it('renders files from property', function() {
		const files = getTestFiles();
		const r = renderer(function() {
			return <FileUploader files={files as any} onValue={noop} />;
		});
		const content = getRenderedFiles(files);

		r.expect(baseAssertion.setChildren(WrappedFileUploadInput, () => [{ content }]));
	});

	it('renders files from FileUploadInput', function() {
		const files = getTestFiles();
		const r = renderer(function() {
			return <FileUploader onValue={noop} />;
		});
		const content = getRenderedFiles([files[0]]);

		r.expect(baseAssertion);
		r.property(WrappedFileUploadInput, 'onValue', files as any);
		r.expect(baseAssertion.setChildren(WrappedFileUploadInput, () => [{ content }]));
	});

	it('renders and validates multiple files from FileUploadInput', function() {
		// This is implemented to produce the same output that getRenderedFiles(getTestFiles()) creates
		function customValidator(file: ReturnType<typeof getTestFiles>[number]) {
			if (file.name === 'file2.png') {
				return {
					valid: false,
					message: 'File is too big'
				};
			} else if (file.name === 'file3.png') {
				return {
					message: 'File is great'
				};
			}
		}

		const files = getTestFiles();
		const r = renderer(function() {
			return (
				<FileUploader customValidator={customValidator as any} multiple onValue={noop} />
			);
		});
		const multipleAssertion = baseAssertion.setProperty(
			WrappedFileUploadInput,
			'multiple',
			true
		);

		r.expect(multipleAssertion);
		r.property(WrappedFileUploadInput, 'onValue', files as any);

		const content = getRenderedFiles(files);
		r.expect(multipleAssertion.setChildren(WrappedFileUploadInput, () => [{ content }]));
	});

	it('renders added files cumulatively when multiple=true', function() {
		const r = renderer(function() {
			return <FileUploader multiple onValue={noop} />;
		});
		const multipleAssertion = baseAssertion.setProperty(
			WrappedFileUploadInput,
			'multiple',
			true
		);

		r.expect(multipleAssertion);
		const files = [{ name: 'file1', size: 100 }];
		r.property(WrappedFileUploadInput, 'onValue', files as any);
		r.expect(
			multipleAssertion.setChildren(WrappedFileUploadInput, () => [
				{ content: getRenderedFiles(files) }
			])
		);

		const moreFiles = [{ name: 'file2', size: 200 }];
		r.property(WrappedFileUploadInput, 'onValue', moreFiles as any);
		r.expect(
			multipleAssertion.setChildren(WrappedFileUploadInput, () => [
				{ content: getRenderedFiles([...files, ...moreFiles]) }
			])
		);
	});

	it('renders only a single file when multiple is not true', function() {
		const r = renderer(function() {
			return <FileUploader onValue={noop} />;
		});

		r.expect(baseAssertion);
		const files = [{ name: 'file1', size: 100 }, { name: 'file2', size: 200 }];
		r.property(WrappedFileUploadInput, 'onValue', files as any);
		r.expect(
			baseAssertion.setChildren(WrappedFileUploadInput, () => [
				{ content: getRenderedFiles([files[0]]) }
			])
		);
		const moreFiles = [{ name: 'file3', size: 300 }, { name: 'file4', size: 400 }];
		r.property(WrappedFileUploadInput, 'onValue', moreFiles as any);
		r.expect(
			baseAssertion.setChildren(WrappedFileUploadInput, () => [
				{ content: getRenderedFiles([moreFiles[0]]) }
			])
		);
	});

	it('validates files on maxSize', function() {
		const maxSize = 500;
		const onValue = sinon.spy();
		const r = renderer(function() {
			return <FileUploader maxSize={maxSize} multiple onValue={onValue} />;
		});
		const multipleAssertion = baseAssertion.setProperty(
			WrappedFileUploadInput,
			'multiple',
			true
		);

		r.expect(multipleAssertion);

		const files = [
			{ name: 'file1', size: 100 },
			{ name: 'file2', size: 0 },
			{ name: 'file3', size: 499 },
			{ name: 'file4', size: 500 },
			{ name: 'file5', size: 501 },
			{ name: 'file6', size: Math.pow(10, 10) }
		];
		const expectedFiles = (files as any).map(function(file: any) {
			const expectedFile = { ...file, message: '', valid: true };
			if (file.size > maxSize) {
				expectedFile.valid = false;
				expectedFile.message = messages.invalidFileSize;
			}

			return expectedFile;
		});
		r.property(WrappedFileUploadInput, 'onValue', files as any);
		r.expect(
			multipleAssertion.setChildren(WrappedFileUploadInput, () => [
				{ content: getRenderedFiles(expectedFiles) }
			])
		);
		assert.deepEqual(onValue.firstCall.args[0], expectedFiles);
	});

	it('removes files', function() {
		const files = getTestFiles();
		const r = renderer(function() {
			return <FileUploader files={files as any} onValue={noop} />;
		});
		const content = getRenderedFiles(files);

		r.expect(baseAssertion.setChildren(WrappedFileUploadInput, () => [{ content }]));
		// TODO: the click event is not firing
		// r.property(WrappedButton, 'onclick');
		// r.expect(baseAssertion.setChildren(WrappedFileUploadInput, () => [{ content: getRenderedFiles(files.slice(1)) }]));
	});

	it('formats bytes up to PB', function() {
		assert.strictEqual(formatBytes(0), '0 B');
		assert.strictEqual(formatBytes(1), '1 B');
		assert.strictEqual(formatBytes(1023), '1023 B');
		assert.strictEqual(formatBytes(1024), '1.00 KB');
		assert.strictEqual(formatBytes(1025), '1.00 KB');
		assert.strictEqual(formatBytes(1034), '1.01 KB');
		assert.strictEqual(formatBytes(Math.pow(1024, 2) - 1), '1023.99 KB');
		assert.strictEqual(formatBytes(Math.pow(1024, 2)), '1.00 MB');
		assert.strictEqual(formatBytes(Math.pow(1024, 2) + 1), '1.00 MB');
		assert.strictEqual(formatBytes(Math.pow(1024, 2) + 10485), '1.01 MB');
		assert.strictEqual(formatBytes(Math.pow(1024, 3) - 1), '1023.99 MB');
		assert.strictEqual(formatBytes(Math.pow(1024, 3)), '1.00 GB');
		assert.strictEqual(formatBytes(Math.pow(1024, 3) + 1), '1.00 GB');
		assert.strictEqual(formatBytes(Math.pow(1024, 3) + 10737418), '1.01 GB');
		assert.strictEqual(formatBytes(Math.pow(1024, 4) - 1), '1023.99 GB');
		assert.strictEqual(formatBytes(Math.pow(1024, 4)), '1.00 TB');
		assert.strictEqual(formatBytes(Math.pow(1024, 4) + 1), '1.00 TB');
		assert.strictEqual(formatBytes(Math.pow(1024, 4) + 10995116277), '1.01 TB');
		assert.strictEqual(formatBytes(Math.pow(1024, 5) - 1), '1023.99 TB');
		assert.strictEqual(formatBytes(Math.pow(1024, 5)), '1.00 PB');
		assert.strictEqual(formatBytes(Math.pow(1024, 5) + 1), '1.00 PB');
		assert.strictEqual(formatBytes(Math.pow(1024, 5) + 11258999068426), '1.01 PB');
		// with no tier above PB there should be no rounding down just below 1024 PB
		assert.strictEqual(formatBytes(Math.pow(1024, 6) - 1), '1024.00 PB');
		// still PB
		assert.strictEqual(formatBytes(Math.pow(1024, 7)), '1048576.00 PB');
	});
});
