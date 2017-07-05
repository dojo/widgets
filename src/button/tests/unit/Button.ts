import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as Test from 'intern/lib/Test';
import * as sinon from 'sinon';

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Button, { ButtonProperties } from '../../Button';
import * as css from '../../styles/button.m.css';

let widget: Harness<ButtonProperties, typeof Button>;

registerSuite({
	name: 'Button',

	beforeEach() {
		widget = harness(Button);
	},

	afterEach() {
		widget.destroy();
	},

	'no content'() {
		widget.expectRender(v('button', {
			'aria-controls': null,
			'aria-describedby': undefined,
			'aria-expanded': null,
			'aria-haspopup': null,
			'aria-pressed': null,
			classes: widget.classes(css.root),
			disabled: undefined,
			id: undefined,
			name: undefined,
			onblur: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener,
			onkeypress: widget.listener,
			onkeyup: widget.listener,
			onmousedown: widget.listener,
			onmouseup: widget.listener,
			ontouchstart: widget.listener,
			ontouchend: widget.listener,
			ontouchcancel: widget.listener,
			type: undefined,
			value: undefined
		}));
	},

	'properties and attributes'() {
		const buttonProperties: ButtonProperties = {
			type: 'submit',
			name: 'bar',
			id: 'qux',
			describedBy: 'baz',
			disabled: true,
			popup: {
				expanded: true,
				id: 'popupId'
			},
			pressed: true,
			value: 'value'
		};
		widget.setProperties(buttonProperties);
		widget.setChildren(['foo']);

		widget.expectRender(v('button', {
			'aria-controls': (<any> buttonProperties.popup).id,
			'aria-describedby': buttonProperties.describedBy,
			'aria-expanded': String((<any> buttonProperties.popup).expanded),
			'aria-haspopup': 'true',
			'aria-pressed': String(buttonProperties.pressed),
			classes: widget.classes(css.root, css.disabled, css.popup, css.pressed),
			disabled: buttonProperties.disabled,
			name: buttonProperties.name,
			id: buttonProperties.id,
			onblur: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener,
			onkeypress: widget.listener,
			onkeyup: widget.listener,
			onmousedown: widget.listener,
			onmouseup: widget.listener,
			ontouchstart: widget.listener,
			ontouchend: widget.listener,
			ontouchcancel: widget.listener,
			type: buttonProperties.type,
			value: buttonProperties.value
		}, [ 'foo' ]));
	},

	'popup = true'() {
		widget.setProperties({
			popup: true
		});

		widget.expectRender(v('button', {
			'aria-controls': '',
			'aria-describedby': undefined,
			'aria-expanded': 'false',
			'aria-haspopup': 'true',
			'aria-pressed': null,
			classes: widget.classes(css.root, css.popup),
			disabled: undefined,
			name: undefined,
			id: undefined,
			onblur: widget.listener,
			onclick: widget.listener,
			onfocus: widget.listener,
			onkeydown: widget.listener,
			onkeypress: widget.listener,
			onkeyup: widget.listener,
			onmousedown: widget.listener,
			onmouseup: widget.listener,
			ontouchstart: widget.listener,
			ontouchend: widget.listener,
			ontouchcancel: widget.listener,
			type: undefined,
			value: undefined
		}));
	},

	events() {
		const onBlur = sinon.spy();
		const onClick = sinon.spy();
		const onFocus = sinon.spy();
		const onKeyDown = sinon.spy();
		const onKeyPress = sinon.spy();
		const onKeyUp = sinon.spy();
		const onMouseDown = sinon.spy();
		const onMouseUp = sinon.spy();

		widget.setProperties({
			onBlur,
			onClick,
			onFocus,
			onKeyDown,
			onKeyPress,
			onKeyUp,
			onMouseDown,
			onMouseUp
		});

		widget.sendEvent('blur');
		assert.isTrue(onBlur.called);
		widget.sendEvent('click');
		assert.isTrue(onClick.called);
		widget.sendEvent('focus');
		assert.isTrue(onFocus.called);
		widget.sendEvent('keydown');
		assert.isTrue(onKeyDown.called);
		widget.sendEvent('keypress');
		assert.isTrue(onKeyPress.called);
		widget.sendEvent('keyup');
		assert.isTrue(onKeyUp.called);
		widget.sendEvent('mousedown');
		assert.isTrue(onMouseDown.called);
		widget.sendEvent('mouseup');
		assert.isTrue(onMouseUp.called);
	},

	'touch events'(this: Test) {
		// TODO: this should be centralized & standardized somewhere
		const hasTouch = has('host-node') || 'ontouchstart' in document ||
			('onpointerdown' in document && navigator.maxTouchPoints > 0);

		if (!hasTouch) {
			this.skip('Touch events not supported');
		}

		const onTouchStart = sinon.spy();
		const onTouchEnd = sinon.spy();
		const onTouchCancel = sinon.spy();

		widget.setProperties({
			onTouchStart,
			onTouchEnd,
			onTouchCancel
		});

		widget.sendEvent('touchstart');
		assert.isTrue(onTouchStart.called);
		widget.sendEvent('touchend');
		assert.isTrue(onTouchEnd.called);
		widget.sendEvent('touchcancel');
		assert.isTrue(onTouchCancel.called);
	}
});
