const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';
import { v, w } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';

import Label from '../../../label/index';
import Textarea from '../../index';
import * as css from '../../../theme/text-area.m.css';
import { compareForId, compareId, createHarness, MockMetaMixin, noop, stubEvent } from '../../../common/tests/support/test-helpers';

const harness = createHarness([ compareId, compareForId ]);

interface States {
	disabled?: boolean;
	required?: boolean;
	invalid?: boolean;
	readOnly?: boolean;
}

const expected = function(label = false, inputOverrides = {}, states: States = {}, focused = false) {
	const { disabled, required, readOnly, invalid } = states;

	return v('div', {
		key: 'root',
		classes: [ css.root, disabled ? css.disabled : null, focused ? css.focused : null, invalid ? css.invalid : null, invalid === false ? css.valid : null, readOnly ? css.readonly : null, required ? css.required : null ]
	}, [
		label ? w(Label, {
			theme: undefined,
			disabled,
			focused,
			hidden: undefined,
			invalid,
			readOnly,
			required,
			forId: ''
		}, [ 'foo' ]) : null,
		v('div', { classes: css.inputWrapper }, [
			v('textarea', {
				classes: css.input,
				id: '',
				key: 'input',
				cols: '20',
				disabled,
				'aria-invalid': invalid ? 'true' : null,
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
		])
	]);
};

registerSuite('Textarea', {
	tests: {
		'default properties'() {
			const h = harness(() => w(Textarea, {}));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() => w(Textarea, {
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
			}));

			h.expect(() => expected(false, {
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
			}));
		},

		'label'() {
			const h = harness(() => w(Textarea, {
				label: 'foo'
			}));

			h.expect(() => expected(true));
		},

		'state classes'() {
			let properties = {
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			};

			const h = harness(() => w(Textarea, properties));

			h.expect(() => expected(false, {}, properties));

			properties = {
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			};
			h.expect(() => expected(false, {}, properties));
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
			const h = harness(() => w(MockMetaMixin(Textarea, mockMeta), {}));
			h.expect(() => expected(false, {}, {}, true));
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

			const h = harness(() => w(Textarea, {
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
});
