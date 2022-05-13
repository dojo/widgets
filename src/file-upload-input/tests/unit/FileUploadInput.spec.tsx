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
import * as labelCss from '../../../theme/default/label.m.css';

const { after, afterEach, describe, it } = intern.getInterface('bdd');
const { messages } = bundle;

describe('FileUploadInput', function() {
	const WrappedRoot = wrap('div');
	const WrappedWrapper = wrap('div');
	const WrappedInput = wrap('input');
	const WrappedButton = wrap(Button);

	const preventDefaultSpy = sinon.spy(stubEvent, 'preventDefault');

	const baseAssertion = assertion(function() {
		return (
			<WrappedRoot key="root" aria-disabled="false" classes={[null, css.root, false]}>
				<WrappedWrapper classes={[css.wrapper]}>
					<WrappedInput
						key="nativeInput"
						accept={undefined}
						aria-hidden="true"
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
								defaultKind: buttonCss.defaultKind,
								disabled: buttonCss.disabled,
								icon: buttonCss.icon,
								iconOnly: buttonCss.iconOnly,
								label: buttonCss.label,
								popup: buttonCss.popup,
								pressed: buttonCss.pressed,
								root: buttonCss.root,
								secondaryKind: buttonCss.secondaryKind
							}
						}}
					>
						{messages.chooseFiles}
					</WrappedButton>
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
						forId="test-input-label"
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
								root: css.labelRoot,
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

	it('renders disabled', function() {
		const r = renderer(function() {
			return <FileUploadInput disabled={true} onValue={noop} />;
		});

		r.expect(
			baseAssertion
				.setProperty(WrappedRoot, 'aria-disabled', 'true')
				.setProperty(WrappedRoot, 'classes', [null, css.root, css.disabled])
				.setProperty(WrappedInput, 'disabled', true)
				.setProperty(WrappedButton, 'disabled', true)
		);
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
