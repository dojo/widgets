const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, compareProperty, findKey } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Textarea from '../../Textarea';
import * as css from '../../styles/textarea.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const expected = function(label = false) {
	return v('div', {
		key: 'root',
		classes: [ css.root, null, null, null, null, null ]
	}, [
		label ? w(Label, {
			theme: undefined,
			disabled: undefined,
			hidden: undefined,
			invalid: undefined,
			readOnly: undefined,
			required: undefined,
			forId: <any> compareId
		}, [ 'foo' ]) : null,
		v('textarea', {
			classes: css.input,
			id: <any> compareId,
			key: 'input',
			cols: null,
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
			rows: null,
			value: undefined,
			wrap: undefined,
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
};

let widget: Harness<Textarea>;

registerSuite('Textarea', {

	beforeEach() {
		widget = harness(Textarea);
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
				columns: 15,
				describedBy: 'foo',
				maxLength: 50,
				minLength: 10,
				name: 'bar',
				placeholder: 'baz',
				rows: 42,
				value: 'qux',
				wrapText: 'soft'
			});

			const expectedVdom = expected();
			assignProperties(findKey(expectedVdom, 'input')!, {
				cols: '15',
				'aria-describedby': 'foo',
				maxlength: '50',
				minlength: '10',
				name: 'bar',
				placeholder: 'baz',
				rows: '42',
				value: 'qux',
				wrap: 'soft'
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

			let expectedVdom = expected();
			assignProperties(findKey(expectedVdom, 'input')!, {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, css.disabled, css.invalid, null, css.readonly, css.required ]
			});

			widget.expectRender(expectedVdom, 'Widget should be invalid, disabled, read-only, and required');

			widget.setProperties({
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			});
			expectedVdom = expected();

			assignProperties(findKey(expectedVdom, 'input')!, {
				disabled: false,
				readOnly: false,
				required: false
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, css.valid, null, null ]
			});

			widget.expectRender(expectedVdom, 'State classes should be false, css.valid should be true');
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

			widget.sendEvent('blur', { selector: 'textarea' });
			assert.isTrue(onBlur.called, 'onBlur called');
			widget.sendEvent('change', { selector: 'textarea' });
			assert.isTrue(onChange.called, 'onChange called');
			widget.sendEvent('click', { selector: 'textarea' });
			assert.isTrue(onClick.called, 'onClick called');
			widget.sendEvent('focus', { selector: 'textarea' });
			assert.isTrue(onFocus.called, 'onFocus called');
			widget.sendEvent('input', { selector: 'textarea' });
			assert.isTrue(onInput.called, 'onInput called');
			widget.sendEvent('keydown', { selector: 'textarea' });
			assert.isTrue(onKeyDown.called, 'onKeyDown called');
			widget.sendEvent('keypress', { selector: 'textarea' });
			assert.isTrue(onKeyPress.called, 'onKeyPress called');
			widget.sendEvent('keyup', { selector: 'textarea' });
			assert.isTrue(onKeyUp.called, 'onKeyUp called');
			widget.sendEvent('mousedown', { selector: 'textarea' });
			assert.isTrue(onMouseDown.called, 'onMouseDown called');
			widget.sendEvent('mouseup', { selector: 'textarea' });
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

			widget.sendEvent('touchstart', { selector: 'textarea' });
			assert.isTrue(onTouchStart.called, 'onTouchStart called');
			widget.sendEvent('touchend', { selector: 'textarea' });
			assert.isTrue(onTouchEnd.called, 'onTouchEnd called');
			widget.sendEvent('touchcancel', { selector: 'textarea' });
			assert.isTrue(onTouchCancel.called, 'onTouchCancel called');
		}
	}
});
