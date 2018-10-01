const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';

import Button from '../../index';
import Icon from '../../../icon/index';
import * as css from '../../../theme/button.m.css';
import { isFocusedComparator, isNotFocusedComparator, noop, stubEvent } from '../../../common/tests/support/test-helpers';

const compareFocusFalse = {
	selector: 'button',
	property: 'focus',
	comparator: isNotFocusedComparator
};

const compareFocusTrue = {
	selector: 'button',
	property: 'focus',
	comparator: isFocusedComparator
};

registerSuite('Button', {
	tests: {
		'no content'() {
			const h = harness(() => w(Button, {}), [ compareFocusFalse ]);
			h.expect(() => v('button', {
				'aria-controls': null,
				'aria-expanded': null,
				'aria-haspopup': null,
				'aria-pressed': null,
				classes: [ css.root, null, null, null ],
				disabled: undefined,
				id: undefined,
				name: undefined,
				focus: noop,
				onblur: noop,
				onclick: noop,
				onfocus: noop,
				onkeydown: noop,
				onkeypress: noop,
				onkeyup: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop,
				type: undefined,
				value: undefined
			}, [ null ]));
		},

		'properties and attributes'() {
			const h = harness(() => w(Button, {
				type: 'submit',
				name: 'bar',
				widgetId: 'qux',
				aria: {
					describedBy: 'baz'
				},
				disabled: true,
				popup: {
					expanded: true,
					id: 'popupId'
				},
				pressed: true,
				value: 'value'
			}, ['foo']), [ compareFocusFalse ]);

			h.expect(() => v('button', {
				'aria-controls': 'popupId',
				'aria-describedby': 'baz',
				'aria-expanded': 'true',
				'aria-haspopup': 'true',
				'aria-pressed': 'true',
				classes: [ css.root, css.disabled, css.popup, css.pressed ],
				disabled: true,
				name: 'bar',
				id: 'qux',
				focus: noop,
				onblur: noop,
				onclick: noop,
				onfocus: noop,
				onkeydown: noop,
				onkeypress: noop,
				onkeyup: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop,
				type: 'submit',
				value: 'value'
			}, [
				'foo',
				v('span', { classes: css.addon }, [
					w(Icon, { type: 'downIcon', theme: undefined })
				])
			]));
		},

		'popup = true'() {
			const h = harness(() => w(Button, {
				popup: true
			}), [ compareFocusFalse ]);

			h.expect(() => v('button', {
				'aria-controls': '',
				'aria-expanded': 'false',
				'aria-haspopup': 'true',
				'aria-pressed': null,
				classes: [ css.root, null, css.popup, null ],
				disabled: undefined,
				name: undefined,
				id: undefined,
				focus: noop,
				onblur: noop,
				onclick: noop,
				onfocus: noop,
				onkeydown: noop,
				onkeypress: noop,
				onkeyup: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop,
				type: undefined,
				value: undefined
			}, [
				v('span', { classes: css.addon }, [
					w(Icon, { type: 'downIcon', theme: undefined })
				])
			]));
		},

		'call focus on button node'() {
			const h = harness(() => w(Button, { focus: () => true }), [ compareFocusTrue ]);
			h.expect(() => v('button', {
				'aria-controls': null,
				'aria-expanded': null,
				'aria-haspopup': null,
				'aria-pressed': null,
				classes: [ css.root, null, null, null ],
				disabled: undefined,
				id: undefined,
				name: undefined,
				focus: noop,
				onblur: noop,
				onclick: noop,
				onfocus: noop,
				onkeydown: noop,
				onkeypress: noop,
				onkeyup: noop,
				onmousedown: noop,
				onmouseup: noop,
				ontouchstart: noop,
				ontouchend: noop,
				ontouchcancel: noop,
				type: undefined,
				value: undefined
			}, [ null ]));
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
			let touchstart = false;
			let touchend = false;
			let touchcancel = false;

			const h = harness(() => w(Button, {
				onBlur: () => { blurred = true; },
				onClick: () => { clicked = true; },
				onFocus: () => { focused = true; },
				onKeyDown: () => { keydown = true; },
				onKeyPress: () => { keypress = true; },
				onKeyUp: () => { keyup = true; },
				onMouseDown: () => { mousedown = true; },
				onMouseUp: () => { mouseup = true; },
				onTouchStart: () => { touchstart = true; },
				onTouchEnd: () => { touchend = true; },
				onTouchCancel: () => { touchcancel = true; }
			}));

			h.trigger('button', 'onblur');
			h.trigger('button', 'onclick', stubEvent);
			h.trigger('button', 'onfocus');
			h.trigger('button', 'onkeydown', stubEvent);
			h.trigger('button', 'onkeypress', stubEvent);
			h.trigger('button', 'onkeyup', stubEvent);
			h.trigger('button', 'onmousedown', stubEvent);
			h.trigger('button', 'onmouseup', stubEvent);
			h.trigger('button', 'ontouchstart', stubEvent);
			h.trigger('button', 'ontouchend', stubEvent);
			h.trigger('button', 'ontouchcancel', stubEvent);

			assert.isTrue(blurred);
			assert.isTrue(clicked);
			assert.isTrue(focused);
			assert.isTrue(keydown);
			assert.isTrue(keypress);
			assert.isTrue(keyup);
			assert.isTrue(mousedown);
			assert.isTrue(mouseup);
			assert.isTrue(touchstart);
			assert.isTrue(touchend);
			assert.isTrue(touchcancel);
		}
	}
});
