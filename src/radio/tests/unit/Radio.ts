const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/core/vdom';
import Focus from '@dojo/framework/core/meta/Focus';

import Label from '../../../label/index';
import Radio from '../../../radio/index';
import * as css from '../../../theme/radio.m.css';
import {
	createHarness,
	compareId,
	compareForId,
	MockMetaMixin,
	noop,
	stubEvent
} from '../../../common/tests/support/test-helpers';

const harness = createHarness([compareId, compareForId]);

interface States {
	valid?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
}

interface ExpectedOptions {
	label?: boolean;
	states?: States;
	focused?: boolean;
	rootOverrides?: any;
	inputOverrides?: any;
}

const expected = function({
	label = false,
	rootOverrides = {},
	inputOverrides = {},
	states = {},
	focused = false
}: ExpectedOptions = {}) {
	const { disabled, valid, required, readOnly } = states;

	const radioVdom = v('div', { classes: css.inputWrapper }, [
		v('input', {
			id: '',
			classes: css.input,
			checked: false,
			disabled: disabled,
			focus: noop,
			'aria-invalid': valid === false ? 'true' : null,
			name: undefined,
			readOnly: readOnly,
			'aria-readonly': readOnly ? 'true' : null,
			required: required,
			type: 'radio',
			value: undefined,
			onblur: noop,
			onfocus: noop,
			onchange: noop,
			...inputOverrides
		}),
		v(
			'div',
			{
				classes: css.radioBackground
			},
			[v('div', { classes: css.radioOuter }), v('div', { classes: css.radioInner })]
		)
	]);

	return v(
		'div',
		{
			key: 'root',
			classes: [css.root, null, null, null, null, null, null, null],
			...rootOverrides
		},
		[
			radioVdom,
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
							forId: '',
							secondary: true
						},
						['foo']
				  )
				: null
		]
	);
};

registerSuite('Radio', {
	tests: {
		'default properties'() {
			const h = harness(() => w(Radio, {}));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() =>
				w(Radio, {
					aria: { describedBy: 'foo' },
					checked: true,
					widgetId: 'foo',
					name: 'bar',
					value: 'baz'
				})
			);

			h.expect(() =>
				expected({
					inputOverrides: {
						checked: true,
						'aria-describedby': 'foo',
						id: 'foo',
						name: 'bar',
						value: 'baz'
					},
					rootOverrides: {
						classes: [css.root, css.checked, null, null, null, null, null, null]
					}
				})
			);
		},

		label() {
			const h = harness(() =>
				w(Radio, {
					label: 'foo'
				})
			);
			h.expect(() => expected({ label: true }));
		},

		'state classes'() {
			const properties = {
				valid: false,
				disabled: true,
				readOnly: true,
				required: true,
				label: 'foo'
			};
			const h = harness(() => w(Radio, properties));
			h.expect(() =>
				expected({
					label: true,
					rootOverrides: {
						classes: [
							css.root,
							null,
							css.disabled,
							null,
							null,
							css.invalid,
							css.readonly,
							css.required
						]
					},
					states: properties
				})
			);

			properties.disabled = false;
			properties.valid = true;
			properties.readOnly = false;
			properties.required = false;

			h.expect(() =>
				expected({
					label: true,
					rootOverrides: {
						classes: [css.root, null, null, null, css.valid, null, null, null]
					},
					states: properties
				})
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
			const h = harness(() => w(MockMetaMixin(Radio, mockMeta), {}), [compareId]);
			h.expect(() =>
				expected({
					rootOverrides: {
						classes: [css.root, null, null, css.focused, null, null, null, null]
					},
					focused: true
				})
			);
		},

		events() {
			const onBlur = sinon.stub();
			const onValue = sinon.stub();
			const onFocus = sinon.stub();

			const h = harness(() =>
				w(Radio, {
					onBlur,
					onValue,
					onFocus
				})
			);
			h.trigger('input', 'onblur', stubEvent);
			assert.isTrue(onBlur.called, 'onBlur called');
			h.trigger('input', 'onchange', stubEvent);
			assert.isTrue(onValue.called, 'onChange called');
			h.trigger('input', 'onfocus', stubEvent);
			assert.isTrue(onFocus.called, 'onFocus called');
		}
	}
});
