const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { v, w } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';

import EnhancedTextInput from '../../index';
import Label from '../../../label/index';
import * as css from '../../../theme/enhanced-text-input.m.css';
import * as textInputCss from '../../../theme/text-input.m.css';
import { VNodeProperties } from '@dojo/framework/widget-core/interfaces';
import { createHarness, compareId, compareForId, MockMetaMixin, noop, stubEvent } from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareId, compareForId ]);

interface States {
	invalid?: boolean;
	disabled?: boolean;
	readOnly?: boolean;
	required?: boolean;
}

interface ExpectedOptions {
	inputOverrides?: VNodeProperties;
	addonBefore?: boolean;
	addonAfter?: boolean;
	label?: boolean;
	states?: States;
	focused?: boolean;
}

const expected = (options: ExpectedOptions = {}) => {
	const {
		inputOverrides = {},
		addonBefore = false,
		addonAfter = false,
		label = false,
		states = {},
		focused = false
	} = options;
	const { readOnly, disabled, required, invalid } = states;
	const children = [
		v('input', {
			'aria-invalid': invalid ? 'true' : null,
			classes: css.input,
			disabled,
			id: '',
			key: 'input',
			maxlength: null,
			minlength: null,
			name: undefined,
			placeholder: undefined,
			readOnly,
			'aria-readonly': readOnly ? 'true' : null,
			required,
			type: 'text',
			value: undefined,
			focus: noop,
			onblur: noop,
			onchange: noop,
			onclick: noop,
			onfocus: noop,
			oninput: noop,
			onkeydown: noop,
			onkeypress: noop,
			onkeyup: noop,
			onmousedown: noop,
			onmouseup: noop,
			ontouchstart: noop,
			ontouchend: noop,
			ontouchcancel: noop,
			...inputOverrides
		})
	];
	if (addonBefore) {
		children.unshift(v('span', {
			classes: [css.addon, css.addonBefore]
		}, [ 'foo' ]));
	}
	if (addonAfter) {
		children.push(v('span', {
			classes: [css.addon, css.addonAfter]
		}, [ 'bar' ]));
	}

	return v('div', {
		key: 'root',
		classes: [
			textInputCss.root,
			disabled ? textInputCss.disabled : null,
			focused ? textInputCss.focused : null,
			invalid ? textInputCss.invalid : null,
			invalid === false ? textInputCss.valid : null,
			readOnly ? textInputCss.readonly : null,
			required ? textInputCss.required : null
		]
	}, [
		label ? w(Label, {
			theme: undefined,
			disabled,
			focused,
			hidden: false,
			invalid,
			readOnly,
			required,
			forId: ''
		}, [ 'foo' ]) : null,
		v('div', { classes: css.inputWrapper }, children)
	]);
};

registerSuite('EnhancedTextInput', {

	tests: {
		'addon before'() {
			const h = harness(() => w(EnhancedTextInput, { addonBefore: [ 'foo' ]}));
			h.expect(() => expected({ addonBefore: true }));
		},

		'addon after'() {
			const h = harness(() => w(EnhancedTextInput, { addonAfter: [ 'bar' ]}));
			h.expect(() => expected({ addonAfter: true }));
		},

		'addons before and after'() {
			const h = harness(() => w(EnhancedTextInput, {
				addonBefore: [ 'foo' ],
				addonAfter: [ 'bar' ]
			}));
			h.expect(() => expected({ addonAfter: true, addonBefore: true }));
		},

		'preserves TextInput functionality': {
			'default properties'() {
				const h = harness(() => w(EnhancedTextInput, {}));
				h.expect(expected);
			},

			'custom properties'() {
				const h = harness(() => w(EnhancedTextInput, {
					aria: {
						controls: 'foo',
						describedBy: 'bar'
					},
					widgetId: 'textinputId',
					maxLength: 50,
					minLength: 10,
					name: 'baz',
					placeholder: 'qux',
					type: 'email',
					value: 'hello world'
				}));

				h.expect(() => expected({
					inputOverrides: {
						'aria-controls': 'foo',
						'aria-describedby': 'bar',
						id: 'textinputId',
						maxlength: '50',
						minlength: '10',
						name: 'baz',
						placeholder: 'qux',
						type: 'email',
						value: 'hello world'
					}
				}));
			},

			'label'() {
				const h = harness(() => w(EnhancedTextInput, {
					label: 'foo'
				}));
				h.expect(() => expected({ label: true }));
			},

			'state classes'() {
				let states: States = {
					invalid: true,
					disabled: true,
					readOnly: true,
					required: true
				};
				const h = harness(() => w(EnhancedTextInput, states));
				h.expect(() => expected({
					states
				}));
				states = {
					invalid: false,
					disabled: false,
					readOnly: false,
					required: false
				};
				h.expect(() => expected({ states }));
			},

			'state classes on label'() {
				let states: States = {
					invalid: true,
					disabled: true,
					readOnly: true,
					required: true
				};
				const h = harness(() => w(EnhancedTextInput, { label: 'foo', ...states }));
				h.expect(() => expected({ label: true, states }));
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
				const h = harness(() => w(MockMetaMixin(EnhancedTextInput, mockMeta), {}));
				h.expect(() => expected({ focused: true }));
			},

			events() {
				const onBlur = sinon.stub();
				const onChange = sinon.stub();
				const onClick = sinon.stub();
				const onFocus = sinon.stub();
				const onInput = sinon.stub();
				const onKeyDown = sinon.stub();
				const onKeyPress = sinon.stub();
				const onKeyUp = sinon.stub();
				const onMouseDown = sinon.stub();
				const onMouseUp = sinon.stub();
				const onTouchStart = sinon.stub();
				const onTouchEnd = sinon.stub();
				const onTouchCancel = sinon.stub();

				const h = harness(() => w(EnhancedTextInput, {
					onBlur,
					onChange,
					onClick,
					onFocus,
					onInput,
					onKeyDown,
					onKeyPress,
					onKeyUp,
					onMouseDown,
					onMouseUp,
					onTouchStart,
					onTouchEnd,
					onTouchCancel
				}));

				h.trigger('@input', 'onblur', stubEvent);
				assert.isTrue(onBlur.called, 'onBlur called');
				h.trigger('@input', 'onchange', stubEvent);
				assert.isTrue(onChange.called, 'onChange called');
				h.trigger('@input', 'onclick', stubEvent);
				assert.isTrue(onClick.called, 'onClick called');
				h.trigger('@input', 'onfocus', stubEvent);
				assert.isTrue(onFocus.called, 'onFocus called');
				h.trigger('@input', 'oninput', stubEvent);
				assert.isTrue(onInput.called, 'onInput called');
				h.trigger('@input', 'onkeydown', stubEvent);
				assert.isTrue(onKeyDown.called, 'onKeyDown called');
				h.trigger('@input', 'onkeypress', stubEvent);
				assert.isTrue(onKeyPress.called, 'onKeyPress called');
				h.trigger('@input', 'onkeyup', stubEvent);
				assert.isTrue(onKeyUp.called, 'onKeyUp called');
				h.trigger('@input', 'onmousedown', stubEvent);
				assert.isTrue(onMouseDown.called, 'onMouseDown called');
				h.trigger('@input', 'onmouseup', stubEvent);
				assert.isTrue(onMouseUp.called, 'onMouseUp called');
				h.trigger('@input', 'ontouchstart', stubEvent);
				assert.isTrue(onTouchStart.called, 'onTouchStart called');
				h.trigger('@input', 'ontouchend', stubEvent);
				assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
				h.trigger('@input', 'ontouchcancel', stubEvent);
				assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
			}
		}
	}
});
