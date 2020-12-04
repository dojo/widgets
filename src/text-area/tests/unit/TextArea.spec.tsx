import createValidityMock from '@dojo/framework/testing/mocks/middleware/validity';

const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { tsx } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import Label from '../../../label/index';
import TextArea from '../../index';
import * as css from '../../../theme/default/text-area.m.css';
import {
	compareForId,
	compareId,
	compareTheme,
	createHarness,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import HelperText from '../../../helper-text/index';
import validity from '@dojo/framework/core/middleware/validity';

const harness = createHarness([compareId, compareForId, compareTheme]);

interface States {
	disabled?: boolean;
	required?: boolean;
	readOnly?: boolean;
	valid?: { valid?: boolean; message?: string } | boolean;
	focused?: boolean;
}

const expected = function(
	label = false,
	inputOverrides = {},
	states: States = {},
	helperText?: string
) {
	const { disabled, required, readOnly, valid: validState, focused } = states;
	let valid: boolean | undefined;
	let message: string | undefined;

	if (validState !== undefined && typeof validState !== 'boolean') {
		valid = validState.valid;
		message = validState.message;
	} else {
		valid = validState;
	}

	const helperTextValue = (valid === false && message) || helperText;

	return (
		<div key="root" classes={[undefined, css.root]}>
			<div
				key="wrapper"
				classes={[
					css.wrapper,
					disabled ? css.disabled : null,
					valid === false ? css.invalid : null,
					valid === true ? css.valid : null,
					readOnly ? css.readonly : null,
					required ? css.required : null,
					focused ? css.focused : null
				]}
			>
				{label ? (
					<Label
						theme={{}}
						classes={undefined}
						variant={undefined}
						disabled={disabled}
						hidden={undefined}
						valid={valid}
						readOnly={readOnly}
						required={required}
						forId=""
						active={false}
						focused={false}
					>
						foo
					</Label>
				) : null}
				<div classes={css.inputWrapper}>
					<textarea
						classes={css.input}
						id=""
						key="input"
						cols={20}
						disabled={disabled}
						focus={noop}
						aria-invalid={valid === false ? 'true' : undefined}
						maxlength={null}
						minlength={null}
						name={undefined}
						placeholder={undefined}
						readOnly={readOnly}
						aria-readonly={readOnly ? 'true' : undefined}
						required={required}
						rows={2}
						value={undefined}
						wrap={undefined}
						onblur={noop}
						onfocus={noop}
						oninput={noop}
						onkeydown={noop}
						onkeyup={noop}
						onclick={noop}
						onpointerenter={noop}
						onpointerleave={noop}
						{...inputOverrides}
					/>
				</div>
			</div>
			<HelperText
				variant={undefined}
				classes={undefined}
				theme={undefined}
				text={helperTextValue}
				valid={valid}
			/>
		</div>
	);
};

const baseAssertion = assertionTemplate(() => (
	<div key="root" classes={[undefined, css.root]}>
		<div key="wrapper" classes={[css.wrapper, null, null, null, null, null, null]}>
			{textarea()}
		</div>
		<HelperText
			variant={undefined}
			classes={undefined}
			theme={undefined}
			assertion-key="helperText"
			text={undefined}
			valid={true}
		/>
	</div>
));

const textarea = () => (
	<div classes={css.inputWrapper}>
		<textarea
			classes={css.input}
			id=""
			key="input"
			cols={20}
			disabled={undefined}
			focus={noop}
			aria-invalid={undefined}
			maxlength={null}
			minlength={null}
			name={undefined}
			placeholder={undefined}
			readOnly={undefined}
			aria-readonly={undefined}
			required={undefined}
			rows={2}
			value={undefined}
			wrap={undefined}
			onblur={noop}
			onfocus={noop}
			oninput={noop}
			onkeydown={noop}
			onkeyup={noop}
			onclick={noop}
			onpointerenter={noop}
			onpointerleave={noop}
		/>
	</div>
);

const valueAssertion = baseAssertion
	.setProperty('@input', 'value', 'test value')
	.setProperty('~helperText', 'valid', undefined);

registerSuite('Textarea', {
	tests: {
		'default properties'() {
			const h = harness(() => <TextArea />);
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() => (
				<TextArea
					aria={{ describedBy: 'foo' }}
					columns={15}
					widgetId="foo"
					maxLength={50}
					minLength={10}
					name="bar"
					placeholder="baz"
					rows={42}
					initialValue="qux"
					wrapText="soft"
				/>
			));

			h.expect(() =>
				expected(false, {
					cols: 15,
					'aria-describedby': 'foo',
					id: 'foo',
					maxlength: '50',
					minlength: '10',
					name: 'bar',
					placeholder: 'baz',
					rows: 42,
					value: 'qux',
					wrap: 'soft'
				})
			);
		},

		label() {
			const h = harness(() => <TextArea>foo</TextArea>);

			h.expect(() => expected(true));
		},

		'named label'() {
			const h = harness(() => <TextArea>{{ label: 'foo' }}</TextArea>);

			h.expect(() => expected(true));
		},

		'state classes'() {
			let properties: States = {
				valid: { valid: false },
				disabled: true,
				readOnly: true,
				required: true
			};

			const h = harness(() => <TextArea {...properties} />);

			h.expect(
				baseAssertion
					.setProperty('@wrapper', 'classes', [
						css.wrapper,
						css.disabled,
						css.invalid,
						null,
						css.readonly,
						css.required,
						null
					])
					.setProperty('@input', 'aria-invalid', 'true')
					.setProperty('@input', 'aria-readonly', 'true')
					.setProperty('@input', 'disabled', true)
					.setProperty('@input', 'readOnly', true)
					.setProperty('@input', 'required', true)
					.setProperty('~helperText', 'valid', false)
			);

			properties = {
				valid: undefined,
				disabled: false,
				readOnly: false,
				required: false
			};
			h.expect(
				baseAssertion
					.setProperty('@wrapper', 'classes', [
						css.wrapper,
						null,
						null,
						null,
						null,
						null,
						null
					])
					.setProperty('@input', 'aria-invalid', undefined)
					.setProperty('@input', 'aria-readonly', undefined)
					.setProperty('@input', 'disabled', false)
					.setProperty('@input', 'readOnly', false)
					.setProperty('@input', 'required', false)
					.setProperty('~helperText', 'valid', undefined)
			);
		},

		helperText() {
			const h = harness(() => <TextArea helperText="test" />);
			h.expect(() => expected(false, {}, {}, 'test'));
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() => (
				<TextArea onBlur={onBlur} onValue={onValue} onFocus={onFocus} />
			));

			h.trigger('@input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('@input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('@input', 'oninput', stubEvent);
		},

		'updates internal value when edited'() {
			const h = harness(() => (
				<TextArea
					aria={{ describedBy: 'foo' }}
					columns={15}
					widgetId="foo"
					maxLength={50}
					minLength={10}
					name="bar"
					placeholder="baz"
					rows={42}
					initialValue="qux"
					wrapText="soft"
				/>
			));

			h.expect(() =>
				expected(false, {
					cols: 15,
					'aria-describedby': 'foo',
					id: 'foo',
					maxlength: '50',
					minlength: '10',
					name: 'bar',
					placeholder: 'baz',
					rows: 42,
					value: 'qux',
					wrap: 'soft'
				})
			);

			h.trigger('@input', 'oninput', { ...stubEvent, target: { value: 'newvalue' } });
			h.expect(() =>
				expected(false, {
					cols: 15,
					'aria-describedby': 'foo',
					id: 'foo',
					maxlength: '50',
					minlength: '10',
					name: 'bar',
					placeholder: 'baz',
					rows: 42,
					value: 'newvalue',
					wrap: 'soft'
				})
			);
		},

		'ignores changes when controlled'() {
			const h = harness(() => (
				<TextArea
					aria={{ describedBy: 'foo' }}
					columns={15}
					widgetId="foo"
					maxLength={50}
					minLength={10}
					name="bar"
					placeholder="baz"
					rows={42}
					value="qux"
					wrapText="soft"
				/>
			));

			const assertion = () =>
				expected(false, {
					cols: 15,
					'aria-describedby': 'foo',
					id: 'foo',
					maxlength: '50',
					minlength: '10',
					name: 'bar',
					placeholder: 'baz',
					rows: 42,
					value: 'qux',
					wrap: 'soft'
				});
			h.expect(assertion);

			h.trigger('@input', 'oninput', { ...stubEvent, target: { value: 'newvalue' } });
			h.expect(assertion);
		},

		onValidate() {
			let mockValidity = createValidityMock();

			let validateSpy = sinon.spy();

			mockValidity('input', { valid: false, message: 'test' });

			let h = harness(() => <TextArea initialValue="test value" onValidate={validateSpy} />, {
				middleware: [[validity, mockValidity]]
			});

			h.expect(valueAssertion);
			assert.isTrue(validateSpy.calledWith(false, 'test'));

			mockValidity = createValidityMock();

			h = harness(() => <TextArea initialValue="test value" onValidate={validateSpy} />, {
				middleware: [[validity, mockValidity]]
			});
			mockValidity('input', { valid: true, message: 'test' });
			h.expect(valueAssertion);

			assert.isTrue(validateSpy.calledWith(true, 'test'));
		},

		'onValidate with a value property'() {
			let mockValidity = createValidityMock();

			let validateSpy = sinon.spy();

			mockValidity('input', { valid: false, message: 'test' });

			let h = harness(() => <TextArea value="test value" onValidate={validateSpy} />, {
				middleware: [[validity, mockValidity]]
			});

			h.expect(valueAssertion);
			assert.isTrue(validateSpy.calledWith(false, 'test'));

			mockValidity = createValidityMock();

			h = harness(() => <TextArea value="test value" onValidate={validateSpy} />, {
				middleware: [[validity, mockValidity]]
			});
			mockValidity('input', { valid: true, message: 'test' });
			h.expect(valueAssertion);

			assert.isTrue(validateSpy.calledWith(true, 'test'));
		},

		'validates as undefined with no initial value'() {
			let mockValidity = createValidityMock();

			let validateSpy = sinon.spy();

			let h = harness(() => <TextArea onValidate={validateSpy} />, {
				middleware: [[validity, mockValidity]]
			});

			h.expect(baseAssertion.setProperty('@helperText', 'valid', undefined));
			assert.isTrue(validateSpy.calledWith(undefined));
		},

		'onValidate only called when validity or message changed'() {
			const mockValidity = createValidityMock();
			let validateSpy = sinon.spy();

			mockValidity('input', { valid: false, message: 'test' });

			harness(
				() => (
					<TextArea
						initialValue="test value"
						valid={{ valid: false, message: 'test' }}
						onValidate={validateSpy}
					/>
				),
				{
					middleware: [[validity, mockValidity]]
				}
			);

			assert.isFalse(validateSpy.called);
		},

		'customValidator not called when native validation fails'() {
			const mockValidity = createValidityMock();
			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon.spy();

			mockValidity('input', { valid: false, message: 'test' });

			harness(
				() => (
					<TextArea
						initialValue="test value"
						onValidate={validateSpy}
						customValidator={customValidatorSpy}
					/>
				),
				{
					middleware: [[validity, mockValidity]]
				}
			);

			assert.isFalse(customValidatorSpy.called);
		},

		'customValidator called when native validation succeeds'() {
			const mockValidity = createValidityMock();
			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon.spy();

			mockValidity('input', { valid: true });

			const h = harness(
				() => (
					<TextArea
						initialValue="test value"
						onValidate={validateSpy}
						customValidator={customValidatorSpy}
					/>
				),
				{
					middleware: [[validity, mockValidity]]
				}
			);

			h.expect(valueAssertion);

			assert.isTrue(customValidatorSpy.called);
		},

		'customValidator can change the validation outcome'() {
			const mockValidity = createValidityMock();
			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon
				.stub()
				.returns({ valid: false, message: 'custom message' });

			mockValidity('input', { valid: true });

			const h = harness(
				() => (
					<TextArea
						initialValue="test value"
						onValidate={validateSpy}
						customValidator={customValidatorSpy}
					/>
				),
				{
					middleware: [[validity, mockValidity]]
				}
			);

			h.expect(valueAssertion);

			assert.isTrue(validateSpy.calledWith(false, 'custom message'));
		}
	}
});
