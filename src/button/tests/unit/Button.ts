import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as Test from 'intern/lib/Test';

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Button, { ButtonProperties } from '../../Button';
import * as css from '../../styles/button.m.css';

let widget: Harness<ButtonProperties, typeof Button>;

registerSuite({
	name: 'Button',
<<<<<<< HEAD

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
			innerHTML: '',
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
			content: 'foo',
=======
	construction() {
		const button = new Button();
		button.__setProperties__({
			name: 'bar'
		});
		assert.strictEqual(button.properties.name, 'bar');
	},

	'correct node attributes'() {
		const button = new Button();
		button.__setProperties__({
>>>>>>> updated button content to use children
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

		widget.expectRender(v('button', {
			'aria-controls': (<any> buttonProperties.popup).id,
			'aria-describedby': buttonProperties.describedBy,
			'aria-expanded': String((<any> buttonProperties.popup).expanded),
			'aria-haspopup': 'true',
			'aria-pressed': String(buttonProperties.pressed),
			classes: widget.classes(css.root, css.disabled, css.popup, css.pressed),
			disabled: buttonProperties.disabled,
			innerHTML: buttonProperties.content,
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
		}));
	},

	'popup = true'() {
		widget.setProperties({
			popup: true
		});
<<<<<<< HEAD

		widget.expectRender(v('button', {
			'aria-controls': '',
			'aria-describedby': undefined,
			'aria-expanded': 'false',
			'aria-haspopup': 'true',
			'aria-pressed': null,
			classes: widget.classes(css.root, css.popup),
			disabled: undefined,
			innerHTML: '',
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
=======
		button.__setChildren__([ 'foo' ]);
		const vnode = <VNode> button.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'button');
		assert.strictEqual(vnode.text, 'foo');
		assert.strictEqual(vnode.properties!.type, 'submit');
		assert.strictEqual(vnode.properties!.name, 'bar');
		assert.strictEqual(vnode.properties!.id, 'qux');
		assert.isTrue(vnode.properties!.disabled);
		assert.strictEqual(vnode.properties!['aria-pressed'], 'true');
		assert.strictEqual(vnode.properties!['aria-describedby'], 'baz');
		assert.strictEqual(vnode.properties!['aria-haspopup'], 'true');
		assert.strictEqual(vnode.properties!['aria-controls'], '');
		assert.strictEqual(vnode.properties!['aria-expanded'], 'false');
	},

	'button without popup'() {
		const button = new Button();
		const vnode = <VNode> button.__render__();
		assert.strictEqual(vnode.properties!['aria-haspopup'], null);
>>>>>>> updated button content to use children
	},

	events() {
		let blurred = false;
		let clicked = false;
		let focused = false;
		let keydown = false;
		let keypress = false;
		let keyup = false;
		let mousedown = false;
		let mouseup = false;

		widget.setProperties({
			onBlur: () => { blurred = true; },
			onClick: () => { clicked = true; },
			onFocus: () => { focused = true; },
			onKeyDown: () => { keydown = true; },
			onKeyPress: () => { keypress = true; },
			onKeyUp: () => { keyup = true; },
			onMouseDown: () => { mousedown = true; },
			onMouseUp: () => { mouseup = true; }
		});

		widget.sendEvent('blur');
		assert.isTrue(blurred);
		widget.sendEvent('click');
		assert.isTrue(clicked);
		widget.sendEvent('focus');
		assert.isTrue(focused);
		widget.sendEvent('keydown');
		assert.isTrue(keydown);
		widget.sendEvent('keypress');
		assert.isTrue(keypress);
		widget.sendEvent('keyup');
		assert.isTrue(keyup);
		widget.sendEvent('mousedown');
		assert.isTrue(mousedown);
		widget.sendEvent('mouseup');
		assert.isTrue(mouseup);
	},

	'touch events'(this: Test) {
		// TODO: this should be centralized & standardized somewhere
		const hasTouch = has('host-node') || 'ontouchstart' in document ||
			('onpointerdown' in document && navigator.maxTouchPoints > 0);

		if (!hasTouch) {
			this.skip('Touch events not supported');
		}

		let touchstart = false;
		let touchend = false;
		let touchcancel = false;

		widget.setProperties({
			onTouchStart: () => { touchstart = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchCancel: () => { touchcancel = true; }
		});

		widget.sendEvent('touchstart');
		assert.isTrue(touchstart);
		widget.sendEvent('touchend');
		assert.isTrue(touchend);
		widget.sendEvent('touchcancel');
		assert.isTrue(touchcancel);
	}
});
