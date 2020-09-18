import { tsx } from '@dojo/framework/core/vdom';
import { assertion, renderer, wrap } from '@dojo/framework/testing/renderer';
import * as sinon from 'sinon';
import { Button } from '../../../button';
import { FileUploadInput } from '../../index';
import { Label } from '../../../label';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';

import bundle from '../../nls/FileUploadInput';
import * as baseCss from '../../../theme/default/base.m.css';
import * as buttonCss from '../../../theme/default/button.m.css';
import * as css from '../../../theme/default/file-upload-input.m.css';
import * as fixedCss from '../../styles/file-upload-input.m.css';
import * as labelCss from '../../../theme/default/label.m.css';

const { after, afterEach, describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');
const { messages } = bundle;

describe('FileUploadInput', function() {
	const WrappedRoot = wrap('div');
	const WrappedWrapper = wrap('div');
	const WrappedInput = wrap('input');
	const WrappedButton = wrap(Button);
	const WrappedLabel = wrap('span');

	const baseRootProperties = {
		key: 'root',
		'aria-disabled': false,
		classes: [null, fixedCss.root, css.root, false, false],
		ondragenter: noop,
		ondragover: noop,
		ondrop: noop
	};

	const preventDefaultSpy = sinon.spy(stubEvent, 'preventDefault');

	const baseAssertion = assertion(function() {
		return (
			<WrappedRoot {...baseRootProperties}>
				<WrappedWrapper classes={[css.wrapper]}>
					<WrappedInput
						key="nativeInput"
						accept={undefined}
						aria-hidden={true}
						classes={[baseCss.hidden]}
						disabled={false}
						multiple={false}
						name={undefined}
						onchange={noop}
						required={false}
						type="file"
					/>
					<WrappedButton
						disabled={false}
						onClick={noop}
						theme={{
							'@dojo/widgets/button': {
								disabled: buttonCss.disabled,
								label: buttonCss.label,
								popup: buttonCss.popup,
								pressed: buttonCss.pressed,
								root: buttonCss.root
							}
						}}
					>
						{messages.chooseFiles}
					</WrappedButton>

					<WrappedLabel classes={[css.dndLabel]}>{messages.orDropFilesHere}</WrappedLabel>
				</WrappedWrapper>
			</WrappedRoot>
		);
	});

	after(function() {
		preventDefaultSpy.restore();
	});

	afterEach(function() {
		preventDefaultSpy.resetHistory();
	});

	it('renders', function() {
		const r = renderer(function() {
			return <FileUploadInput onValue={noop} />;
		});

		r.expect(baseAssertion);
	});

	it('renders content', function() {
		const content = <div>some content</div>;

		const r = renderer(function() {
			return (
				<FileUploadInput onValue={noop}>
					{{
						content
					}}
				</FileUploadInput>
			);
		});

		r.expect(baseAssertion.insertAfter(WrappedWrapper, () => [content]));
	});

	it('renders label', function() {
		const label = 'Widget label';

		const r = renderer(function() {
			return (
				<FileUploadInput onValue={noop}>
					{{
						label
					}}
				</FileUploadInput>
			);
		});

		r.expect(
			baseAssertion.prepend(WrappedRoot, function() {
				return [
					<Label
						disabled={false}
						forId="file-upload-input-test"
						hidden={false}
						required={false}
						theme={{
							'@dojo/widgets/label': {
								active: labelCss.active,
								disabled: labelCss.disabled,
								focused: labelCss.focused,
								invalid: labelCss.invalid,
								readonly: labelCss.readonly,
								required: labelCss.required,
								root: labelCss.root,
								secondary: labelCss.secondary,
								valid: labelCss.valid
							}
						}}
						valid={true}
					>
						{label}
					</Label>
				];
			})
		);
	});

	it('renders allowDnd=false', function() {
		const r = renderer(function() {
			return <FileUploadInput allowDnd={false} onValue={noop} />;
		});

		r.expect(
			baseAssertion
				.setProperties(WrappedRoot, {
					...baseRootProperties,
					ondragenter: false,
					ondragover: false,
					ondrop: false
				})
				.remove(WrappedLabel)
		);
	});

	it('renders disabled', function() {
		const r = renderer(function() {
			return <FileUploadInput disabled={true} onValue={noop} />;
		});

		r.expect(
			baseAssertion
				.setProperties(WrappedRoot, {
					...baseRootProperties,
					'aria-disabled': true,
					classes: [null, fixedCss.root, css.root, false, css.disabled],
					ondragenter: false,
					ondragover: false,
					ondrop: false
				})
				.setProperty(WrappedInput, 'disabled', true)
				.setProperty(WrappedButton, 'disabled', true)
		);
	});

	it('handles dragenter, dragleave, and the overlay', function() {
		const r = renderer(function() {
			return <FileUploadInput onValue={noop} />;
		});
		const WrappedOverlay = wrap('div');

		r.expect(baseAssertion);
		r.property(WrappedRoot, 'ondragenter', stubEvent);

		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'classes', [
					null,
					fixedCss.root,
					css.root,
					css.dndActive,
					false
				])
				.append(WrappedRoot, function() {
					return [
						<WrappedOverlay
							key="overlay"
							classes={[fixedCss.dndOverlay, css.dndOverlay, false]}
							ondragleave={noop}
						/>
					];
				})
		);
		assert(preventDefaultSpy.called, 'dragenter handler should call event.preventDefault()');
		preventDefaultSpy.resetHistory();

		// TODO: enable when https://github.com/dojo/framework/pull/840 is merged
		// r.property(WrappedOverlay, 'ondragleave', stubEvent);
		// r.expect(baseAssertion);
		// assert(preventDefaultSpy.called, 'dragleave handler should call event.preventDefault()');
	});

	it('handles file drop event', function() {
		const testValues = [1, 2, 3];
		const onValue = sinon.stub();

		const r = renderer(function() {
			return <FileUploadInput multiple onValue={onValue} />;
		});

		r.expect(baseAssertion.setProperty(WrappedInput, 'multiple', true));
		r.property(WrappedRoot, 'ondrop', {
			...stubEvent,
			dataTransfer: {
				files: testValues
			}
		});
		r.expect(baseAssertion.setProperty(WrappedInput, 'multiple', true));

		assert(preventDefaultSpy.called, 'drop handler should call event.preventDefault()');
		assert.sameOrderedMembers(onValue.firstCall.args[0], testValues);
	});

	it('restricts file drop to one file if multiple is not true', function() {
		const testValues = [1, 2, 3];
		const expected = testValues.slice(0, 1);
		const onValue = sinon.stub();

		const r = renderer(function() {
			return <FileUploadInput onValue={onValue} />;
		});

		r.expect(baseAssertion);
		r.property(WrappedRoot, 'ondrop', {
			...stubEvent,
			dataTransfer: {
				files: testValues
			}
		});
		r.expect(baseAssertion);

		assert.sameMembers(onValue.firstCall.args[0], expected);
	});

	it('validates files based on "accept"', function() {
		const accept = 'application/pdf,image/*,.gif';
		const testFiles = [
			{ name: 'file1.pdf', type: 'application/pdf' }, // test direct match: application/pdf
			{ name: 'file2.png', type: 'image/png' }, // test wildcard match: image/*
			{ name: 'file3.gif', type: 'bad/type' }, // test extension match: .gif
			{ name: 'file4.doc', type: 'application/msword' } // test match failure
		];
		const validFiles = testFiles.slice(0, 3);
		const onValue = sinon.stub();

		const r = renderer(function() {
			return <FileUploadInput multiple onValue={onValue} accept={accept} />;
		});
		const acceptAssertion = baseAssertion
			.setProperty(WrappedInput, 'accept', accept)
			.setProperty(WrappedInput, 'multiple', true);

		r.expect(acceptAssertion);
		r.property(WrappedRoot, 'ondrop', {
			preventDefault: noop,
			dataTransfer: {
				files: testFiles
			}
		});
		r.expect(acceptAssertion);

		assert.sameOrderedMembers(onValue.firstCall.args[0], validFiles);
	});

	it('calls onValue when files are selected from input', function() {
		const testValues = [1, 2, 3];
		const onValue = sinon.stub();

		const r = renderer(function() {
			return <FileUploadInput multiple onValue={onValue} />;
		});

		r.expect(baseAssertion.setProperty(WrappedInput, 'multiple', true));
		r.property(WrappedInput, 'onchange', {
			target: {
				files: testValues
			}
		});
		r.expect(baseAssertion.setProperty(WrappedInput, 'multiple', true));

		// TODO: enable when https://github.com/dojo/framework/pull/840 is merged
		// assert.sameOrderedMembers(onValue.firstCall.args[0], testValues);
	});
});
