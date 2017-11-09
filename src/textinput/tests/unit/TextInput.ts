const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import TextInput from '../../TextInput';
import * as css from '../../styles/textinput.m.css';

const expected = function(label = false, classes: (string | null)[] = [ css.root, null, null, null, null, null ]) {
	const inputVdom = v('div', [
		v('input', {
			classes: css.input,
			'aria-controls': undefined,
			'aria-describedby': undefined,
			disabled: undefined,
			'aria-invalid': null,
			maxlength: null,
			minlength: null,
			name: undefined,
			placeholder: undefined,
			readOnly: undefined,
			'aria-readonly': null,
			required: undefined,
			type: 'text',
			value: undefined,
			onblur: widget.listener,
			onchange: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			oninput: widget.listener,
			onkeydown: widget.listener,
			onkeypress: widget.listener,
			onkeyup: widget.listener,
			onmousedown: widget.listener,
			onmouseup: widget.listener,
			ontouchstart: widget.listener,
			ontouchend: widget.listener,
			ontouchcancel: widget.listener
		})
	]);

	if (label) {
		return w(Label, {
			extraClasses: { root: css.root },
			label: 'foo',
			theme: undefined
		}, [ inputVdom ]);
	}
	else {
		return v('div', {
			classes
		}, [ inputVdom ]);
	}
};

let widget: Harness<TextInput>;

registerSuite('TextInput', {

	beforeEach() {
		widget = harness(TextInput);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default properties'() {
			widget.expectRender(expected());
		},

		'custom properties'() {
			widget.setProperties({
				controls: 'foo',
				describedBy: 'bar',
				maxLength: 50,
				minLength: 10,
				name: 'baz',
				placeholder: 'qux',
				type: 'email',
				value: 'hello world'
			});

			const expectedVdom = expected();
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, null, null, null ]
			});
			assignChildProperties(expectedVdom, '0,0', {
				'aria-controls': 'foo',
				'aria-describedby': 'bar',
				maxlength: '50',
				minlength: '10',
				name: 'baz',
				placeholder: 'qux',
				type: 'email',
				value: 'hello world'
			});

			widget.expectRender(expectedVdom);
		},

		'label'() {
			widget.setProperties({
				label: 'foo'
			});

			widget.expectRender(expected(true));
		},

		'state classes'() {
			widget.setProperties({
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			});

			let expectedVdom = expected(false, [ css.root, css.disabled, css.invalid, null, css.readonly, css.required ]);
			assignChildProperties(expectedVdom, '0,0', {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});

			widget.expectRender(expectedVdom, 'Widget should be invalid, disabled, read-only, and required');

			widget.setProperties({
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			});
			expectedVdom = expected();

			assignChildProperties(expectedVdom, '0,0', {
				disabled: false,
				readOnly: false,
				required: false
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, css.valid, null, null ]
			});

			widget.expectRender(expectedVdom, 'State classes should be false, css.valid should be true');
		},

		'state classes on label'() {
			widget.setProperties({
				label: 'foo',
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			});

			const expectedVdom = expected(true);
			assignChildProperties(expectedVdom, '0,0', {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});
			assignProperties(expectedVdom, {
				extraClasses: { root: `${css.root} ${css.disabled} ${css.invalid} ${css.readonly} ${css.required}` }
			});
			widget.expectRender(expectedVdom);
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

			widget.setProperties({
				onBlur,
				onChange,
				onClick,
				onFocus,
				onInput,
				onKeyDown,
				onKeyPress,
				onKeyUp,
				onMouseDown,
				onMouseUp
			});

			widget.sendEvent('blur', { selector: 'input' });
			assert.isTrue(onBlur.called, 'onBlur called');
			widget.sendEvent('change', { selector: 'input' });
			assert.isTrue(onChange.called, 'onChange called');
			widget.sendEvent('click', { selector: 'input' });
			assert.isTrue(onClick.called, 'onClick called');
			widget.sendEvent('focus', { selector: 'input' });
			assert.isTrue(onFocus.called, 'onFocus called');
			widget.sendEvent('input', { selector: 'input' });
			assert.isTrue(onInput.called, 'onInput called');
			widget.sendEvent('keydown', { selector: 'input' });
			assert.isTrue(onKeyDown.called, 'onKeyDown called');
			widget.sendEvent('keypress', { selector: 'input' });
			assert.isTrue(onKeyPress.called, 'onKeyPress called');
			widget.sendEvent('keyup', { selector: 'input' });
			assert.isTrue(onKeyUp.called, 'onKeyUp called');
			widget.sendEvent('mousedown', { selector: 'input' });
			assert.isTrue(onMouseDown.called, 'onMouseDown called');
			widget.sendEvent('mouseup', { selector: 'input' });
			assert.isTrue(onMouseUp.called, 'onMouseUp called');
		},

		'touch events'() {
			if (!has('touch')) {
				this.skip('Environment not support touch events');
			}

			const onTouchStart = sinon.stub();
			const onTouchEnd = sinon.stub();
			const onTouchCancel = sinon.stub();

			widget.setProperties({
				onTouchStart,
				onTouchEnd,
				onTouchCancel
			});

			widget.sendEvent('touchstart', { selector: 'input' });
			assert.isTrue(onTouchStart.called, 'onTouchStart called');
			widget.sendEvent('touchend', { selector: 'input' });
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
			widget.sendEvent('touchcancel', { selector: 'input' });
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
