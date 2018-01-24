const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import harness from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';

import Button from '../../Button';
import * as css from '../../../theme/button/button.m.css';
import * as iconCss from '../../../theme/common/icons.m.css';

const noop = () => {};

registerSuite('Button', {
	tests: {
		'no content'() {
			const h = harness(() => w(Button, {}));
			h.expect(() => v('button', {
				'aria-controls': null,
				'aria-expanded': null,
				'aria-haspopup': null,
				'aria-pressed': null,
				classes: [ css.root, null, null, null ],
				disabled: undefined,
				id: undefined,
				name: undefined,
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
				id: 'qux',
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
			}, ['foo']));

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
				v('i', {
					classes: [ css.addon, iconCss.icon, iconCss.downIcon ],
					role: 'presentation',
					'aria-hidden': 'true'
				})
			]));
		},

		'popup = true'() {
			const h = harness(() => w(Button, {
				popup: true
			}));

			h.expect(() => v('button', {
				'aria-controls': '',
				'aria-expanded': 'false',
				'aria-haspopup': 'true',
				'aria-pressed': null,
				classes: [ css.root, null, css.popup, null ],
				disabled: undefined,
				name: undefined,
				id: undefined,
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
				v('i', {
					classes: [ css.addon, iconCss.icon, iconCss.downIcon ],
					role: 'presentation',
					'aria-hidden': 'true'
				})
			]));
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
			h.trigger('button', 'onclick');
			h.trigger('button', 'onfocus');
			h.trigger('button', 'onkeydown');
			h.trigger('button', 'onkeypress');
			h.trigger('button', 'onkeyup');
			h.trigger('button', 'onmousedown');
			h.trigger('button', 'onmouseup');
			h.trigger('button', 'ontouchstart');
			h.trigger('button', 'ontouchend');
			h.trigger('button', 'ontouchcancel');

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
