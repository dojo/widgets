const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';

import EnhancedTextInput from '../../EnhancedTextInput';
import Label from '../../../label/Label';
import * as css from '../../../theme/enhancedtextinput/enhancedtextinput.m.css';
import * as textInputCss from '../../../theme/textinput/textinput.m.css';
import { WNode, VNodeProperties } from '@dojo/widget-core/interfaces';

const compareId = { selector: '*', property: 'id', comparator: (property: any) => typeof property === 'string' };
const compareForId = { selector: '*', property: 'forId', comparator: (property: any) => typeof property === 'string' };
const noop = () => {};
const createHarnessWithCompare = (renderFunction: () => WNode) => {
	return harness(renderFunction, [ compareId, compareForId ]);
};

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
}

const expected = (options: ExpectedOptions = {}) => {
	const {
		inputOverrides = {},
		addonBefore = false,
		addonAfter = false,
		label = false,
		states = {}
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
			invalid ? textInputCss.invalid : null,
			invalid === false ? textInputCss.valid : null,
			readOnly ? textInputCss.readonly : null,
			required ? textInputCss.required : null
		]
	}, [
		label ? w(Label, {
			theme: undefined,
			disabled,
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
			const h = createHarnessWithCompare(() => w(EnhancedTextInput, { addonBefore: [ 'foo' ]}));
			h.expect(() => expected({ addonBefore: true }));
		},

		'addon after'() {
			const h = createHarnessWithCompare(() => w(EnhancedTextInput, { addonAfter: [ 'bar' ]}));
			h.expect(() => expected({ addonAfter: true }));
		},

		'addons before and after'() {
			const h = createHarnessWithCompare(() => w(EnhancedTextInput, {
				addonBefore: [ 'foo' ],
				addonAfter: [ 'bar' ]
			}));
			h.expect(() => expected({ addonAfter: true, addonBefore: true }));
		},

		'preserves TextInput functionality': {
			'default properties'() {
				const h = createHarnessWithCompare(() => w(EnhancedTextInput, {}));
				h.expect(expected);
			},

			'custom properties'() {
				const h = createHarnessWithCompare(() => w(EnhancedTextInput, {
					aria: {
						controls: 'foo',
						describedBy: 'bar'
					},
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
				const h = createHarnessWithCompare(() => w(EnhancedTextInput, {
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
				const h = createHarnessWithCompare(() => w(EnhancedTextInput, states));
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
				const h = createHarnessWithCompare(() => w(EnhancedTextInput, { label: 'foo', ...states }));
				h.expect(() => expected({ label: true, states }));
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

				const h = createHarnessWithCompare(() => w(EnhancedTextInput, {
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

				h.trigger('@input', 'onblur');
				assert.isTrue(onBlur.called, 'onBlur called');
				h.trigger('@input', 'onchange');
				assert.isTrue(onChange.called, 'onChange called');
				h.trigger('@input', 'onclick');
				assert.isTrue(onClick.called, 'onClick called');
				h.trigger('@input', 'onfocus');
				assert.isTrue(onFocus.called, 'onFocus called');
				h.trigger('@input', 'oninput');
				assert.isTrue(onInput.called, 'onInput called');
				h.trigger('@input', 'onkeydown');
				assert.isTrue(onKeyDown.called, 'onKeyDown called');
				h.trigger('@input', 'onkeypress');
				assert.isTrue(onKeyPress.called, 'onKeyPress called');
				h.trigger('@input', 'onkeyup');
				assert.isTrue(onKeyUp.called, 'onKeyUp called');
				h.trigger('@input', 'onmousedown');
				assert.isTrue(onMouseDown.called, 'onMouseDown called');
				h.trigger('@input', 'onmouseup');
				assert.isTrue(onMouseUp.called, 'onMouseUp called');
				h.trigger('@input', 'ontouchstart');
				assert.isTrue(onTouchStart.called, 'onTouchStart called');
				h.trigger('@input', 'ontouchend');
				assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
				h.trigger('@input', 'ontouchcancel');
				assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
			}
		}
	}
});
