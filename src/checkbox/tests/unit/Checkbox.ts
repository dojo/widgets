import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as Test from 'intern/lib/Test';

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { HNode } from '@dojo/widget-core/interfaces';

import Checkbox, { CheckboxProperties, Mode } from '../../Checkbox';
import Label, { LabelProperties } from '../../../label/Label';
import * as css from '../../styles/checkbox.m.css';

let widget: Harness<CheckboxProperties, typeof Checkbox>;

registerSuite({
	name: 'Checkbox',

	beforeEach() {
		widget = harness(Checkbox);
	},

	afterEach() {
		widget.destroy();
	},

	simple() {
		const children: HNode[] = [
			v('div', {
				classes: widget.classes(css.inputWrapper)
			}, [
				null,
				null,
				v('input', {
					'aria-describedby': undefined,
					'aria-invalid': null,
					'aria-readonly': null,
					bind: widget,
					checked: false,
					classes: widget.classes(css.input),
					disabled: undefined,
					name: undefined,
					onblur: widget.listener,
					onchange: widget.listener,
					onclick: widget.listener,
					onfocus: widget.listener,
					onmousedown: widget.listener,
					onmouseup: widget.listener,
					ontouchstart: widget.listener,
					ontouchend: widget.listener,
					ontouchcancel: widget.listener,
					readOnly: undefined,
					required: undefined,
					type: 'checkbox',
					value: undefined
				})
			])
		];

		widget.setChildren(children);

		widget.expectRender(v('div', {
			classes: widget.classes(css.root)
		}, children));
	},

	'properties and attributes'() {
		const checkboxProperties: CheckboxProperties = {
			bind: widget,
			checked: true,
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			mode: Mode.toggle,
			name: 'bar',
			offLabel: 'Off',
			onLabel: 'On',
			readOnly: true,
			required: true,
			value: 'qux'
		};
		const children: HNode[] = [
			v('div', {
				classes: widget.classes(css.inputWrapper)
			}, [
				v('div', { classes: widget.classes(css.onLabel) }, [ checkboxProperties.onLabel! ]),
				v('div', { classes: widget.classes(css.offLabel) }, [ checkboxProperties.offLabel! ]),
				v('input', {
					'aria-describedby': checkboxProperties.describedBy,
					'aria-invalid': String(checkboxProperties.invalid),
					'aria-readonly': String(checkboxProperties.readOnly),
					bind: widget,
					checked: checkboxProperties.checked,
					classes: widget.classes(css.input),
					disabled: checkboxProperties.disabled,
					name: checkboxProperties.name,
					onblur: widget.listener,
					onchange: widget.listener,
					onclick: widget.listener,
					onfocus: widget.listener,
					onmousedown: widget.listener,
					onmouseup: widget.listener,
					ontouchstart: widget.listener,
					ontouchend: widget.listener,
					ontouchcancel: widget.listener,
					readOnly: checkboxProperties.readOnly,
					required: checkboxProperties.required,
					type: 'checkbox',
					value: checkboxProperties.value
				})
			])
		];

		widget.setProperties(checkboxProperties);

		// TODO: is there a better way to do this than a throwaway Checkbox instance?
		const checkbox = new Checkbox();
		widget.expectRender(w<LabelProperties>(Label, {
			classes: checkbox.classes(css.root, css.toggle, css.checked, css.disabled, css.invalid, css.readonly, css.required),
			formId: checkboxProperties.formId,
			label: checkboxProperties.label!
		}, children));
	},

	// TODO: is it preferred to combine this with the previous test?
	// Manipulating the harness and the expected results is more hassle than it's worth
	'properties and attributes 2'() {
		const children: HNode[] = [
			v('div', {
				classes: widget.classes(css.inputWrapper)
			}, [
				v('div', { classes: widget.classes(css.onLabel) }, [ null ]),
				v('div', { classes: widget.classes(css.offLabel) }, [ null ]),
				v('input', {
					'aria-describedby': undefined,
					'aria-invalid': null,
					'aria-readonly': null,
					bind: widget,
					checked: false,
					classes: widget.classes(css.input),
					disabled: undefined,
					name: undefined,
					onblur: widget.listener,
					onchange: widget.listener,
					onclick: widget.listener,
					onfocus: widget.listener,
					onmousedown: widget.listener,
					onmouseup: widget.listener,
					ontouchstart: widget.listener,
					ontouchend: widget.listener,
					ontouchcancel: widget.listener,
					readOnly: undefined,
					required: undefined,
					type: 'checkbox',
					value: undefined
				})
			])
		];

		widget.setChildren(children);
		widget.setProperties({
			invalid: false,
			mode: Mode.toggle
		});

		widget.expectRender(v('div', {
			classes: widget.classes(css.root, css.toggle, css.valid)
		}, children));
	},

	events() {
		let blurred = false;
		let changed = false;
		let clicked = false;
		let focused = false;
		let mousedown = false;
		let mouseup = false;

		widget.setProperties({
			onBlur: () => { blurred = true; },
			onChange: () => { changed = true; },
			onClick: () => { clicked = true; },
			onFocus: () => { focused = true; },
			onMouseDown: () => { mousedown = true; },
			onMouseUp: () => { mouseup = true; }
		});

		widget.sendEvent('blur', { selector: 'input' });
		assert.isTrue(blurred);
		widget.sendEvent('change', { selector: 'input' });
		assert.isTrue(changed);
		widget.sendEvent('click', { selector: 'input' });
		assert.isTrue(clicked);
		widget.sendEvent('focus', { selector: 'input' });
		assert.isTrue(focused);
		widget.sendEvent('mousedown', { selector: 'input' });
		assert.isTrue(mousedown);
		widget.sendEvent('mouseup', { selector: 'input' });
		assert.isTrue(mouseup);
	},

	'touch events'(this: Test) {
		// TODO: this should be centralized & standardized somewhere
		const hasTouch = has('host-node') || 'ontouchstart' in document ||
			('onpointerdown' in document && navigator.maxTouchPoints > 0);

		if (!hasTouch) {
			this.skip('Touch events not supported');
		}

		let touchcancel = false;
		let touchend = false;
		let touchstart = false;

		widget.setProperties({
			onTouchCancel: () => { touchcancel = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchStart: () => { touchstart = true; }
		});

		widget.sendEvent('touchcancel', { selector: 'input' });
		assert.isTrue(touchcancel);
		widget.sendEvent('touchend', { selector: 'input' });
		assert.isTrue(touchend);
		widget.sendEvent('touchstart', { selector: 'input' });
		assert.isTrue(touchstart);
	}
});
