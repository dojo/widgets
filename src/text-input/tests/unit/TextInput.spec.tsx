const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import focus from '@dojo/framework/core/middleware/focus';
import validity from '@dojo/framework/core/middleware/validity';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';
import createFocusMock from '@dojo/framework/testing/mocks/middleware/focus';
import createValidityMock from '@dojo/framework/testing/mocks/middleware/validity';

import Label from '../../../label/index';
import TextInput from '../../index';
import * as css from '../../../theme/default/text-input.m.css';
import {
	compareForId,
	compareId,
	createHarness,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import HelperText from '../../../helper-text/index';
import { SupportedClassName } from '@dojo/framework/core/interfaces';

const harness = createHarness([compareId, compareForId]);

interface States {
	disabled?: boolean;
	required?: boolean;
	readOnly?: boolean;
	valid?: { valid?: boolean; message?: string } | boolean;
}

interface DefaultExpectedOptions {
	inputOverrides?: any;
	states?: States;
	helperText?: string;
	value?: string;
	wrapperClasses?: SupportedClassName[];
	lineRippleClasses?: SupportedClassName[];
}

const defaultExpected = function({
	inputOverrides = {},
	states = {},
	helperText,
	value,
	wrapperClasses = [
		css.wrapper,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		css.noLabel,
		null,
		css.defaultKind,
		null
	],
	lineRippleClasses = [css.lineRipple, null]
}: DefaultExpectedOptions = {}) {
	const { disabled, required, readOnly, valid: validState } = states;
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
		<div key="root" classes={[undefined, css.root]} role="presentation">
			<div key="wrapper" classes={wrapperClasses} role="presentation">
				<span classes={css.ripple} />
				<input
					aria-invalid={valid === false ? 'true' : undefined}
					autocomplete="off"
					classes={css.input}
					disabled={disabled}
					id={''}
					focus={noop}
					key={'input'}
					max={undefined}
					maxlength={null}
					min={undefined}
					minlength={null}
					name={undefined}
					pattern={undefined}
					placeholder={undefined}
					readOnly={readOnly}
					aria-readonly={readOnly ? 'true' : undefined}
					required={required}
					step={undefined}
					type="text"
					value={value}
					onblur={noop}
					onfocus={noop}
					oninput={noop}
					onkeydown={noop}
					onkeyup={noop}
					onclick={noop}
					onpointerenter={noop}
					onpointerleave={noop}
					onanimationstart={noop}
					{...inputOverrides}
				/>
				<span classes={lineRippleClasses} />
			</div>
			<HelperText
				text={helperTextValue}
				valid={valid}
				classes={undefined}
				variant={undefined}
				theme={undefined}
			/>
		</div>
	);
};

const baseAssertion = assertionTemplate(() => {
	return (
		<div key="root" classes={[undefined, css.root]} role="presentation">
			<div
				key="wrapper"
				role="presentation"
				classes={[
					css.wrapper,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					css.noLabel,
					null,
					css.defaultKind,
					null
				]}
			>
				{input()}
			</div>
			<HelperText
				assertion-key="helperText"
				text={undefined}
				valid={undefined}
				classes={undefined}
				variant={undefined}
				theme={undefined}
			/>
		</div>
	);
});

const defaultKindAssertion = baseAssertion
	.prepend('@wrapper', () => [<span classes={css.ripple} />])
	.append('@wrapper', () => [
		<span assertion-key="lineRipple" classes={[css.lineRipple, null]} />
	]);

const defaultKindLabeledAssertion = defaultKindAssertion
	.prepend('@wrapper', () => [
		<Label
			assertion-key="label"
			theme={undefined}
			disabled={undefined}
			valid={undefined}
			focused={false}
			readOnly={undefined}
			required={undefined}
			hidden={false}
			forId={''}
			active={false}
			classes={undefined}
			variant={undefined}
		>
			foo
		</Label>
	])
	.setProperty('@wrapper', 'classes', [
		css.wrapper,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		css.defaultKind,
		null
	]);

const outlinedUnlabeledAssertion = baseAssertion
	.prepend('@wrapper', () => [
		<div assertion-key="notchedOutline" classes={[css.notchedOutline, false]}>
			<div classes={css.notchedOutlineLeading} />
			{false}
			<div classes={css.notchedOutlineTrailing} />
		</div>
	])
	.setProperty('@wrapper', 'classes', [
		css.wrapper,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		css.noLabel,
		css.outlinedKind,
		null,
		null
	]);

const outlinedLabeledAssertion = baseAssertion
	.prepend('@wrapper', () => [
		<div assertion-key="notchedOutline" classes={[css.notchedOutline, false]}>
			<div classes={css.notchedOutlineLeading} />
			<div assertion-key="notch" classes={css.notchedOutlineNotch} styles={{ width: 'auto' }}>
				<span key="label">
					<Label
						assertion-key="label"
						theme={undefined}
						disabled={undefined}
						valid={undefined}
						focused={false}
						readOnly={undefined}
						required={undefined}
						hidden={false}
						forId={''}
						active={false}
						classes={undefined}
						variant={undefined}
					>
						foo
					</Label>
				</span>
			</div>
			<div classes={css.notchedOutlineTrailing} />
		</div>
	])
	.setProperty('@wrapper', 'classes', [
		css.wrapper,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		null,
		css.outlinedKind,
		null,
		null
	]);

const input = () => (
	<input
		key="input"
		classes={css.input}
		id=""
		disabled={undefined}
		aria-invalid={undefined}
		autocomplete="off"
		maxlength={null}
		minlength={null}
		name={undefined}
		placeholder={undefined}
		readOnly={undefined}
		aria-readonly={undefined}
		required={undefined}
		type="text"
		value={undefined}
		focus={noop}
		pattern={undefined}
		onblur={noop}
		onfocus={noop}
		oninput={noop}
		onkeydown={noop}
		onkeyup={noop}
		onclick={noop}
		onpointerenter={noop}
		onpointerleave={noop}
		onanimationstart={noop}
		min={undefined}
		max={undefined}
		step={undefined}
	/>
);

registerSuite('TextInput', {
	tests: {
		'default properties'() {
			const h = harness(() => <TextInput />);
			h.expect(defaultKindAssertion);
		},

		'controlled value'() {
			const h = harness(() => <TextInput value="foo" />);
			const valueTemplate = defaultKindAssertion
				.setProperty('@input', 'value', 'foo')
				.setProperty('@wrapper', 'classes', [
					css.wrapper,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					css.noLabel,
					null,
					css.defaultKind,
					null
				]);
			h.expect(valueTemplate);
		},

		'custom properties'() {
			const h = harness(() => (
				<TextInput
					aria={{
						controls: 'foo',
						describedBy: 'bar'
					}}
					widgetId="foo"
					maxLength={50}
					minLength={10}
					name="bar"
					placeholder="baz"
					type="email"
				/>
			));

			h.expect(() =>
				defaultExpected({
					inputOverrides: {
						'aria-controls': 'foo',
						'aria-describedby': 'bar',
						id: 'foo',
						maxlength: '50',
						minlength: '10',
						name: 'bar',
						placeholder: 'baz',
						type: 'email'
					}
				})
			);
		},

		label() {
			const h = harness(() => <TextInput>{{ label: 'foo' }}</TextInput>);

			h.expect(defaultKindLabeledAssertion);
		},

		pattern: {
			string() {
				const h = harness(() => <TextInput pattern="^foo|bar$" />);

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							pattern: '^foo|bar$'
						}
					})
				);
			},
			regexp() {
				const properties = {
					pattern: /^foo|bar$/
				};
				const h = harness(() => <TextInput {...properties} />);

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							pattern: '^foo|bar$'
						}
					})
				);

				(properties.pattern.compile as any)('^bar|baz$');

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							pattern: '^bar|baz$'
						}
					})
				);

				properties.pattern = /^ham|spam$/;

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							pattern: '^ham|spam$'
						}
					})
				);
			}
		},

		autocomplete: {
			true() {
				const h = harness(() => <TextInput autocomplete />);

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							autocomplete: 'on'
						}
					})
				);
			},
			false() {
				const h = harness(() => <TextInput autocomplete={false} />);

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							autocomplete: 'off'
						}
					})
				);
			},
			string() {
				const h = harness(() => <TextInput autocomplete="name" />);

				h.expect(() =>
					defaultExpected({
						inputOverrides: {
							autocomplete: 'name'
						}
					})
				);
			}
		},

		'state classes'() {
			let properties: any = {
				disabled: true,
				readOnly: true,
				required: true,
				valid: true
			};
			const h = harness(() => <TextInput {...properties} />);

			h.expect(() =>
				defaultExpected({
					states: properties,
					wrapperClasses: [
						css.wrapper,
						css.disabled,
						null,
						null,
						css.valid,
						css.readonly,
						css.required,
						null,
						null,
						css.noLabel,
						null,
						css.defaultKind,
						null
					]
				})
			);

			properties = {
				disabled: false,
				readOnly: false,
				required: false,
				valid: false
			};

			h.expect(() =>
				defaultExpected({
					states: properties,
					wrapperClasses: [
						css.wrapper,
						null,
						null,
						css.invalid,
						null,
						null,
						null,
						null,
						null,
						css.noLabel,
						null,
						css.defaultKind,
						null
					]
				})
			);

			properties = {
				disabled: false,
				readOnly: false,
				required: false,
				valid: { valid: false, message: 'test' }
			};

			h.expect(() =>
				defaultExpected({
					states: properties,
					wrapperClasses: [
						css.wrapper,
						null,
						null,
						css.invalid,
						null,
						null,
						null,
						null,
						null,
						css.noLabel,
						null,
						css.defaultKind,
						null
					]
				})
			);
		},

		'focused class'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('input', true);
			validityMock('input', { valid: undefined, message: '' });

			const h = harness(() => <TextInput />, {
				middleware: [[focus, focusMock], [validity, validityMock]]
			});
			h.expect(() =>
				defaultExpected({
					wrapperClasses: [
						css.wrapper,
						null,
						css.focused,
						null,
						null,
						null,
						null,
						null,
						null,
						css.noLabel,
						null,
						css.defaultKind,
						css.defaultKindFocused
					],
					lineRippleClasses: [css.lineRipple, css.defaultKindLineRippleFocused]
				})
			);
		},

		helperText() {
			const helperText = 'test';
			const h = harness(() => <TextInput helperText={helperText} />);

			h.expect(() => defaultExpected({ helperText }));
		},

		onValidate() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			validityMock('input', { valid: false, message: 'test' });
			focusMock('isFocused', false);

			let validateSpy = sinon.spy();

			let h = harness(
				() => <TextInput initialValue="test value" onValidate={validateSpy} />,
				{
					middleware: [[focus, focusMock], [validity, validityMock]]
				}
			);

			h.expect(assertionTemplate(() => defaultExpected({ value: 'test value' })));

			assert.isTrue(validateSpy.calledWith(false, 'test'));

			validityMock('input', { valid: true, message: '' });

			h = harness(() => <TextInput initialValue="test value" onValidate={validateSpy} />, {
				middleware: [[focus, focusMock], [validity, validityMock]]
			});

			h.trigger('@input', '');
			h.expect(assertionTemplate(() => defaultExpected({ value: 'test value' })));

			assert.isTrue(validateSpy.calledWith(true, ''));
		},

		'onValidate called when validity or message changed'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('isFocused', false);
			validityMock('input', { valid: false, message: 'test' });

			let validateSpy = sinon.spy();

			const h = harness(
				() => (
					<TextInput
						initialValue="test value"
						valid={{ valid: false, message: 'test' }}
						onValidate={validateSpy}
					/>
				),
				{ middleware: [[focus, focusMock], [validity, validityMock]] }
			);

			h.expect(
				assertionTemplate(() =>
					defaultExpected({
						value: 'test value',
						states: {
							valid: { valid: false, message: 'test' }
						},
						wrapperClasses: [
							css.wrapper,
							null,
							null,
							css.invalid,
							null,
							null,
							null,
							null,
							null,
							css.noLabel,
							null,
							css.defaultKind,
							null
						]
					})
				)
			);

			assert.isFalse(validateSpy.called);
		},

		'onValidate called with undefined on initial render'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('isFocused', false);
			validityMock('input', { valid: false, message: 'test' });

			let validateSpy = sinon.spy();

			const h = harness(() => <TextInput onValidate={validateSpy} />, {
				middleware: [[focus, focusMock], [validity, validityMock]]
			});

			h.expect(defaultExpected);
			validateSpy.calledWith(undefined, '');
		},

		'customValidator not called when native validation fails'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('isFocused', false);
			validityMock('input', { valid: false, message: 'test' });

			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon.spy();

			const h = harness(
				() => (
					<TextInput
						initialValue="test value"
						onValidate={validateSpy}
						customValidator={customValidatorSpy}
					/>
				),
				{ middleware: [[focus, focusMock], [validity, validityMock]] }
			);

			h.expect(assertionTemplate(() => defaultExpected({ value: 'test value' })));

			assert.isFalse(customValidatorSpy.called);
		},

		'customValidator called when native validation succeeds'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('isFocused', false);
			validityMock('input', { valid: true });

			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon.spy();

			const h = harness(
				() => (
					<TextInput
						initialValue="test value"
						onValidate={validateSpy}
						customValidator={customValidatorSpy}
					/>
				),
				{ middleware: [[focus, focusMock], [validity, validityMock]] }
			);

			h.expect(assertionTemplate(() => defaultExpected({ value: 'test value' })));

			assert.isTrue(customValidatorSpy.called);
		},

		'customValidator can change the validation outcome'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('isFocused', false);
			validityMock('input', { valid: false, message: 'custom message' });

			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon
				.stub()
				.returns({ valid: false, message: 'custom message' });

			const h = harness(
				() => (
					<TextInput
						initialValue="test value"
						onValidate={validateSpy}
						customValidator={customValidatorSpy}
					/>
				),
				{ middleware: [[focus, focusMock], [validity, validityMock]] }
			);

			h.expect(assertionTemplate(() => defaultExpected({ value: 'test value' })));

			assert.isTrue(validateSpy.calledWith(false, 'custom message'));
		},

		'leading property'() {
			const leading = <span classes={css.leading}>A</span>;
			const leadingTemplate = defaultKindAssertion
				.setProperty('@wrapper', 'classes', [
					css.wrapper,
					null,
					null,
					null,
					null,
					null,
					null,
					css.hasLeading,
					null,
					css.noLabel,
					null,
					css.defaultKind,
					null
				])
				.prepend('@wrapper', () => [leading]);
			const h = harness(() => <TextInput>{{ leading: 'A' }}</TextInput>);
			h.expect(leadingTemplate);
		},

		'trailing property'() {
			const trailing = <span classes={css.trailing}>Z</span>;
			const trailingTemplate = defaultKindAssertion
				.setProperty('@wrapper', 'classes', [
					css.wrapper,
					null,
					null,
					null,
					null,
					null,
					null,
					null,
					css.hasTrailing,
					css.noLabel,
					null,
					css.defaultKind,
					null
				])
				.append('@wrapper', () => [trailing]);
			const h = harness(() => <TextInput>{{ trailing: 'Z' }}</TextInput>);
			h.expect(trailingTemplate);
		},

		events() {
			const onBlur = sinon.stub();
			const onFocus = sinon.stub();
			const onValue = sinon.stub();
			const onKey = sinon.stub();

			const h = harness(() => (
				<TextInput onBlur={onBlur} onFocus={onFocus} onValue={onValue} onKeyDown={onKey} />
			));

			h.trigger('@input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('@input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('@input', 'oninput', stubEvent);
			assert.isTrue(onValue.called, 'onValue called');
			h.trigger('@input', 'onkeydown', stubEvent);
			assert.isTrue(onKey.called, 'onKey called');
			h.trigger('@input', 'onkeypress', stubEvent);
		},

		'handles value changes from outside the DOM'() {
			const clock = sinon.useFakeTimers();
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			let editedValues: undefined | { required: string } = undefined;
			let values = { required: 'Initial' };
			let validityValue:
				| boolean
				| {
						valid?: boolean | undefined;
						message?: string | undefined;
				  }
				| undefined;

			focusMock('isFocused', false);
			let placeholder: string | undefined;
			const h = harness(
				() => (
					<TextInput
						widgetId="required"
						required={true}
						onValue={(value) => {
							editedValues = {
								...values,
								...editedValues,
								required: value as string
							};
						}}
						initialValue={editedValues ? editedValues.required : values.required}
						valid={validityValue}
						onValidate={(valid, message) => (validityValue = { valid, message })}
						placeholder={placeholder}
					/>
				),
				{ middleware: [[focus, focusMock], [validity, validityMock]] }
			);

			let assertion = defaultKindAssertion
				.setProperty('@wrapper', 'classes', [
					css.wrapper,
					null,
					null,
					null,
					null,
					null,
					css.required,
					null,
					null,
					css.noLabel,
					null,
					css.defaultKind,
					null
				])
				.setProperty('@input', 'required', true)
				.setProperty('@input', 'value', 'Initial');
			h.expect(assertion);

			h.trigger('@input', 'oninput', { ...stubEvent, ...{ target: { value: '' } } });
			validityMock('input', { valid: false, message: 'Please fill out this field.' });
			h.expect(assertion.setProperty('@input', 'value', ''));

			const invalidAssertion = assertion
				.setProperty('@wrapper', 'classes', [
					css.wrapper,
					null,
					null,
					css.invalid,
					null,
					null,
					css.required,
					null,
					null,
					css.noLabel,
					null,
					css.defaultKind,
					null
				])
				.setProperty('@input', 'aria-invalid', 'true')
				.setProperty('~helperText', 'text', 'Please fill out this field.')
				.setProperty('~helperText', 'valid', false)
				.setProperty('@input', 'value', '');
			h.expect(invalidAssertion);

			editedValues = undefined;
			h.expect(invalidAssertion.setProperty('@input', 'value', 'Initial'));

			validityMock('input', { valid: true, message: '' });
			placeholder = ''; // Force render
			h.expect(
				invalidAssertion
					.setProperty('@input', 'value', 'Initial')
					.setProperty('@input', 'placeholder', '')
			);

			placeholder = undefined;
			assert.deepEqual(validityValue, { valid: true, message: '' }, 'Input should be valid');
			h.expect(
				assertion
					.setProperty('@wrapper', 'classes', [
						css.wrapper,
						null,
						null,
						null,
						css.valid,
						null,
						css.required,
						null,
						null,
						css.noLabel,
						null,
						css.defaultKind,
						null
					])
					.setProperty('~helperText', 'valid', true)
			);
			clock.restore();
		},
		hiddenLabel() {
			const h = harness(() => <TextInput labelHidden={true}>{{ label: 'foo' }}</TextInput>);

			h.expect(
				defaultKindLabeledAssertion
					.setProperty('~label', 'hidden', true)
					.setProperty('@wrapper', 'classes', [
						css.wrapper,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						css.noLabel,
						null,
						css.defaultKind,
						null
					])
			);
		},

		'autofill sets active'() {
			const h = harness(() => <TextInput>{{ label: 'foo' }}</TextInput>);
			h.expect(defaultKindLabeledAssertion);

			h.trigger('@input', 'onanimationstart', {
				...stubEvent,
				animationName: 'other-animation'
			});
			h.expect(defaultKindLabeledAssertion);

			h.trigger('@input', 'onanimationstart', {
				...stubEvent,
				animationName: css.onAutofillShown
			});
			const activeTemplate = defaultKindLabeledAssertion.setProperty(
				'~label',
				'active',
				true
			);
			h.expect(activeTemplate);
		},

		'outline kind'() {
			const h = harness(() => <TextInput kind="outlined" />);
			h.expect(outlinedUnlabeledAssertion);
		},

		'outline focused class'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('input', true);
			validityMock('input', { valid: undefined, message: '' });

			const h = harness(() => <TextInput kind="outlined" />, {
				middleware: [[focus, focusMock], [validity, validityMock]]
			});
			h.expect(
				outlinedUnlabeledAssertion
					.setProperty('@wrapper', 'classes', [
						css.wrapper,
						null,
						css.focused,
						null,
						null,
						null,
						null,
						null,
						null,
						css.noLabel,
						css.outlinedKind,
						null,
						null
					])
					.setProperty('~notchedOutline', 'classes', [
						css.notchedOutline,
						css.notchedOutlineNotched
					])
			);
		},

		'outlined label'() {
			const h = harness(() => <TextInput kind="outlined">{{ label: 'foo' }}</TextInput>);

			h.expect(outlinedLabeledAssertion);
		},

		'outlined label focused'() {
			const focusMock = createFocusMock();
			const validityMock = createValidityMock();

			focusMock('input', true);
			validityMock('input', { valid: undefined, message: '' });

			const h = harness(() => <TextInput kind="outlined">{{ label: 'foo' }}</TextInput>, {
				middleware: [[focus, focusMock], [validity, validityMock]]
			});
			h.expect(
				outlinedLabeledAssertion
					.setProperty('@wrapper', 'classes', [
						css.wrapper,
						null,
						css.focused,
						null,
						null,
						null,
						null,
						null,
						null,
						null,
						css.outlinedKind,
						null,
						null
					])
					.setProperty('~label', 'active', true)
					.setProperty('~label', 'focused', true)
					.setProperty('~notch', 'styles', { width: '10px' })
					.setProperty('~notchedOutline', 'classes', [
						css.notchedOutline,
						css.notchedOutlineNotched
					])
			);
		}
	}
});
