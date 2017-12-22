const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v } from '@dojo/widget-core/d';

import Button, { ButtonProperties } from '../../Button';
import * as css from '../../styles/button.m.css';
import * as iconCss from '../../../common/styles/icons.m.css';

let widget: Harness<Button>;

registerSuite('Button', {
	beforeEach() {
		widget = harness(Button);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'no content'() {
			// prettier-ignore
			widget.expectRender(
				v('button', {
					'aria-controls': null,
					'aria-describedby': undefined,
					'aria-expanded': null,
					'aria-haspopup': null,
					'aria-pressed': null,
					classes: [css.root, null, null, null],
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
				}, [ null ])
			);
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

			// prettier-ignore
			widget.expectRender(
				v('button', {
					'aria-controls': (<any> buttonProperties.popup).id,
					'aria-describedby': buttonProperties.describedBy,
					'aria-expanded': String((<any> buttonProperties.popup).expanded),
					'aria-haspopup': 'true',
					'aria-pressed': String(buttonProperties.pressed),
					classes: [css.root, css.disabled, css.popup, css.pressed],
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
				}, [
					'foo',
					v('i', {
						classes: [css.addon, iconCss.icon, iconCss.downIcon],
						role: 'presentation',
						'aria-hidden': 'true'
					})
				])
			);
		},

		'popup = true'() {
			widget.setProperties({
				popup: true
			});

			// prettier-ignore
			widget.expectRender(
				v('button', {
					'aria-controls': '',
					'aria-describedby': undefined,
					'aria-expanded': 'false',
					'aria-haspopup': 'true',
					'aria-pressed': null,
					classes: [css.root, null, css.popup, null],
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
				}, [
					v('i', {
						classes: [css.addon, iconCss.icon, iconCss.downIcon],
						role: 'presentation',
						'aria-hidden': 'true'
					})
				])
			);
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
				onBlur: () => {
					blurred = true;
				},
				onClick: () => {
					clicked = true;
				},
				onFocus: () => {
					focused = true;
				},
				onKeyDown: () => {
					keydown = true;
				},
				onKeyPress: () => {
					keypress = true;
				},
				onKeyUp: () => {
					keyup = true;
				},
				onMouseDown: () => {
					mousedown = true;
				},
				onMouseUp: () => {
					mouseup = true;
				}
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

		'touch events'() {
			if (!has('touch')) {
				this.skip('Touch events not supported');
			}

			let touchstart = false;
			let touchend = false;
			let touchcancel = false;

			widget.setProperties({
				onTouchStart: () => {
					touchstart = true;
				},
				onTouchEnd: () => {
					touchend = true;
				},
				onTouchCancel: () => {
					touchcancel = true;
				}
			});

			widget.sendEvent('touchstart');
			assert.isTrue(touchstart);
			widget.sendEvent('touchend');
			assert.isTrue(touchend);
			widget.sendEvent('touchcancel');
			assert.isTrue(touchcancel);
		}
	}
});
