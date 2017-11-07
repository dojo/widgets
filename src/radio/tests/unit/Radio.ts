const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import has from '@dojo/has/has';
import { v, w } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';

import Label from '../../../label/Label';
import Radio from '../../Radio';
import * as css from '../../styles/radio.m.css';

const expected = function(widget: Harness<Radio>, label = false) {
	const radioVdom = v('div', { classes: css.inputWrapper }, [
		v('input', {
			classes: css.input,
			checked: false,
			'aria-describedby': undefined,
			disabled: undefined,
			'aria-invalid': null,
			name: undefined,
			readOnly: undefined,
			'aria-readonly': null,
			required: undefined,
			type: 'radio',
			value: undefined,
			onblur: widget.listener,
			onchange: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
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
		}, [ radioVdom ]);
	}
	else {
		return v('div', {
			classes: [ css.root, null, null, null, null, null, null, null ]
		}, [ radioVdom ]);
	}
};

let widget: Harness<Radio>;

registerSuite('Radio', {

	beforeEach() {
		widget = harness(Radio);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default properties'() {
			widget.expectRender(expected(widget));
		},

		'custom properties'() {
			widget.setProperties({
				checked: true,
				describedBy: 'foo',
				name: 'bar',
				value: 'baz'
			});

			const expectedVdom = expected(widget);
			assignChildProperties(expectedVdom, '0,0', {
				checked: true,
				'aria-describedby': 'foo',
				name: 'bar',
				value: 'baz'
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, css.checked, null, null, null, null, null, null ]
			});

			widget.expectRender(expectedVdom);
		},

		'label'() {
			widget.setProperties({
				label: 'foo'
			});

			widget.expectRender(expected(widget, true));
		},

		'state classes'() {
			widget.setProperties({
				invalid: true,
				disabled: true,
				readOnly: true,
				required: true
			});

			let expectedVdom = expected(widget);
			assignChildProperties(expectedVdom, '0,0', {
				disabled: true,
				'aria-invalid': 'true',
				readOnly: true,
				'aria-readonly': 'true',
				required: true
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, css.disabled, null, css.invalid, null, css.readonly, css.required ]
			});

			widget.expectRender(expectedVdom, 'Widget should be invalid, disabled, read-only, and required');

			widget.setProperties({
				invalid: false,
				disabled: false,
				readOnly: false,
				required: false
			});
			expectedVdom = expected(widget);

			assignChildProperties(expectedVdom, '0,0', {
				disabled: false,
				readOnly: false,
				required: false
			});
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, null, null, css.valid, null, null ]
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

			const expectedVdom = expected(widget, true);
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

		'focused class'() {
			let expectedVdom = expected(widget);
			widget.expectRender(expectedVdom);

			widget.sendEvent('focus', { selector: 'input' });
			expectedVdom = expected(widget);
			assignProperties(expectedVdom, {
				classes: [ css.root, null, null, css.focused, null, null, null, null ]
			});
			widget.expectRender(expectedVdom, 'Should have focused class after focus event');

			widget.sendEvent('blur', { selector: 'input' });
			expectedVdom = expected(widget);
			widget.expectRender(expectedVdom, 'Should not have focused class after blur event');
		},

		events() {
			const onBlur = sinon.stub();
			const onChange = sinon.stub();
			const onClick = sinon.stub();
			const onFocus = sinon.stub();
			const onMouseDown = sinon.stub();
			const onMouseUp = sinon.stub();

			widget.setProperties({
				onBlur,
				onChange,
				onClick,
				onFocus,
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
