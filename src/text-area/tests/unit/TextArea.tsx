const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w, tsx } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';
import assertionTemplate from '@dojo/framework/testing/assertionTemplate';

import Label from '../../../label/index';
import TextArea from '../../index';
import * as css from '../../../theme/text-area.m.css';
import {
	compareForId,
	compareId,
	createHarness,
	MockMetaMixin,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';
import HelperText from '../../../helper-text/index';
import InputValidity from '@dojo/framework/core/meta/InputValidity';

const harness = createHarness([compareId, compareForId]);

interface States {
	disabled?: boolean;
	required?: boolean;
	readOnly?: boolean;
	valid?: { valid?: boolean; message?: string } | boolean;
}

const expected = function(
	label = false,
	inputOverrides = {},
	states: States = {},
	focused = false,
	helperText?: string
) {
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

	return v(
		'div',
		{
			key: 'root',
			classes: [
				css.root,
				disabled ? css.disabled : null,
				focused ? css.focused : null,
				valid === false ? css.invalid : null,
				valid === true ? css.valid : null,
				readOnly ? css.readonly : null,
				required ? css.required : null
			]
		},
		[
			label
				? w(
						Label,
						{
							theme: undefined,
							classes: undefined,
							disabled,
							focused,
							hidden: undefined,
							valid,
							readOnly,
							required,
							forId: ''
						},
						['foo']
				  )
				: null,
			v('div', { classes: css.inputWrapper }, [
				v('textarea', {
					classes: css.input,
					id: '',
					key: 'input',
					cols: '20',
					disabled,
					focus: noop,
					'aria-invalid': valid === false ? 'true' : null,
					maxlength: null,
					minlength: null,
					name: undefined,
					placeholder: undefined,
					readOnly,
					'aria-readonly': readOnly ? 'true' : null,
					required,
					rows: '2',
					value: undefined,
					wrap: undefined,
					onblur: noop,
					onfocus: noop,
					oninput: noop,
					onkeydown: noop,
					onkeyup: noop,
					onclick: noop,
					onpointerenter: noop,
					onpointerleave: noop,
					...inputOverrides
				})
			]),
			w(HelperText, { text: helperTextValue, valid })
		]
	);
};

const baseAssertion = assertionTemplate(() => (
	<div key="root" classes={[css.root, null, null, null, null, null, null]}>
		{textarea()}
		<HelperText assertion-key="helperText" text={undefined} valid={true} />
	</div>
));

const textarea = () => (
	<div classes={css.inputWrapper}>
		<textarea
			classes={css.input}
			id=""
			key="input"
			cols="20"
			disabled={undefined}
			focus={noop}
			aria-invalid={null}
			maxlength={null}
			minlength={null}
			name={undefined}
			placeholder={undefined}
			readOnly={undefined}
			aria-readonly={null}
			required={undefined}
			rows="2"
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

registerSuite('Textarea', {
	tests: {
		'default properties'() {
			const h = harness(() => w(TextArea, {}));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() =>
				w(TextArea, {
					aria: { describedBy: 'foo' },
					columns: 15,
					widgetId: 'foo',
					maxLength: 50,
					minLength: 10,
					name: 'bar',
					placeholder: 'baz',
					rows: 42,
					value: 'qux',
					wrapText: 'soft'
				})
			);

			h.expect(() =>
				expected(false, {
					cols: '15',
					'aria-describedby': 'foo',
					id: 'foo',
					maxlength: '50',
					minlength: '10',
					name: 'bar',
					placeholder: 'baz',
					rows: '42',
					value: 'qux',
					wrap: 'soft'
				})
			);
		},

		label() {
			const h = harness(() =>
				w(TextArea, {
					label: 'foo'
				})
			);

			h.expect(() => expected(true));
		},

		'state classes'() {
			let properties: States = {
				valid: { valid: false },
				disabled: true,
				readOnly: true,
				required: true
			};

			const h = harness(() => w(TextArea, properties));

			h.expect(
				baseAssertion
					.setProperty(':root', 'classes', [
						css.root,
						css.disabled,
						null,
						css.invalid,
						null,
						css.readonly,
						css.required
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
					.setProperty(':root', 'classes', [css.root, null, null, null, null, null, null])
					.setProperty('@input', 'aria-invalid', null)
					.setProperty('@input', 'aria-readonly', null)
					.setProperty('@input', 'disabled', false)
					.setProperty('@input', 'readOnly', false)
					.setProperty('@input', 'required', false)
					.setProperty('~helperText', 'valid', undefined)
			);
		},

		'focused class'() {
			const mockMeta = sinon.stub();
			const mockFocusGet = sinon.stub().returns({
				active: false,
				containsFocus: true
			});
			mockMeta.withArgs(Focus).returns({
				get: mockFocusGet
			});
			const h = harness(() => w(MockMetaMixin(TextArea, mockMeta), {}));
			h.expect(() => expected(false, {}, {}, true));
		},

		helperText() {
			const h = harness(() => w(TextArea, { helperText: 'test' }));
			h.expect(() => expected(false, {}, {}, false, 'test'));
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() =>
				w(TextArea, {
					onBlur,
					onValue,
					onFocus
				})
			);

			h.trigger('@input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('@input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
			h.trigger('@input', 'oninput', stubEvent);
		},

		onValidate() {
			const mockMeta = sinon.stub();
			let validateSpy = sinon.spy();

			mockMeta.withArgs(InputValidity).returns({
				get: sinon.stub().returns({ valid: false, message: 'test' })
			});

			mockMeta.withArgs(Focus).returns({
				get: () => ({ active: false, containsFocus: false })
			});

			harness(() =>
				w(MockMetaMixin(TextArea, mockMeta), {
					value: 'test value',
					onValidate: validateSpy
				})
			);

			assert.isTrue(validateSpy.calledWith(false, 'test'));

			mockMeta.withArgs(InputValidity).returns({
				get: sinon.stub().returns({ valid: true, message: '' })
			});

			harness(() =>
				w(MockMetaMixin(TextArea, mockMeta), {
					value: 'test value',
					onValidate: validateSpy
				})
			);

			assert.isTrue(validateSpy.calledWith(true, ''));
		},

		'onValidate only called when validity or message changed'() {
			const mockMeta = sinon.stub();
			let validateSpy = sinon.spy();

			mockMeta.withArgs(InputValidity).returns({
				get: sinon.stub().returns({ valid: false, message: 'test' })
			});

			mockMeta.withArgs(Focus).returns({
				get: () => ({ active: false, containsFocus: false })
			});

			harness(() =>
				w(MockMetaMixin(TextArea, mockMeta), {
					value: 'test value',
					valid: { valid: false, message: 'test' },
					onValidate: validateSpy
				})
			);

			assert.isFalse(validateSpy.called);
		},

		'customValidator not called when native validation fails'() {
			const mockMeta = sinon.stub();
			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon.spy();

			mockMeta.withArgs(InputValidity).returns({
				get: sinon.stub().returns({ valid: false, message: 'test' })
			});

			mockMeta.withArgs(Focus).returns({
				get: () => ({ active: false, containsFocus: false })
			});

			harness(() =>
				w(MockMetaMixin(TextArea, mockMeta), {
					value: 'test value',
					onValidate: validateSpy,
					customValidator: customValidatorSpy
				})
			);

			assert.isFalse(customValidatorSpy.called);
		},

		'customValidator called when native validation succeeds'() {
			const mockMeta = sinon.stub();
			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon.spy();

			mockMeta.withArgs(InputValidity).returns({
				get: sinon.stub().returns({ valid: true })
			});

			mockMeta.withArgs(Focus).returns({
				get: () => ({ active: false, containsFocus: false })
			});

			harness(() =>
				w(MockMetaMixin(TextArea, mockMeta), {
					value: 'test value',
					onValidate: validateSpy,
					customValidator: customValidatorSpy
				})
			);

			assert.isTrue(customValidatorSpy.called);
		},

		'customValidator can change the validation outcome'() {
			const mockMeta = sinon.stub();
			let validateSpy = sinon.spy();
			let customValidatorSpy = sinon
				.stub()
				.returns({ valid: false, message: 'custom message' });

			mockMeta.withArgs(InputValidity).returns({
				get: sinon.stub().returns({ valid: true })
			});

			mockMeta.withArgs(Focus).returns({
				get: () => ({ active: false, containsFocus: false })
			});

			harness(() =>
				w(MockMetaMixin(TextArea, mockMeta), {
					value: 'test value',
					onValidate: validateSpy,
					customValidator: customValidatorSpy
				})
			);

			assert.isTrue(validateSpy.calledWith(false, 'custom message'));
		}
	}
});
