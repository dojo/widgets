import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as Test from 'intern/lib/Test';

import has from '@dojo/has/has';
import harness, { Harness } from '@dojo/test-extras/harness';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';

import Checkbox, { CheckboxProperties, Mode } from '../../Checkbox';
import Label, { parseLabelClasses } from '../../../label/Label';
import * as css from '../../styles/checkbox.m.css';

let widget: Harness<CheckboxProperties, typeof Checkbox>;

function expectedChildrenRender(properties: CheckboxProperties = {}): DNode[] {
	return [
		v('div', {
			classes: widget.classes(css.inputWrapper)
		}, [
			properties.mode === Mode.toggle ?
				v('div', { classes: widget.classes(css.onLabel) }, [
					properties.onLabel ? properties.onLabel : null
				]) : null,
			properties.mode === Mode.toggle ?
				v('div', { classes: widget.classes(css.offLabel) }, [
					properties.offLabel ? properties.offLabel : null
				]) : null,
			v('input', {
				'aria-describedby': properties.describedBy,
				'aria-invalid': properties.invalid ? String(properties.invalid) : null,
				'aria-readonly': properties.readOnly ? String(properties.readOnly) : null,
				checked: properties.checked ? true : false,
				classes: widget.classes(css.input),
				disabled: properties.disabled ? true : undefined,
				name: properties.name,
				onblur: widget.listener,
				onchange: widget.listener,
				onclick: widget.listener,
				onfocus: widget.listener,
				onmousedown: widget.listener,
				onmouseup: widget.listener,
				ontouchstart: widget.listener,
				ontouchend: widget.listener,
				ontouchcancel: widget.listener,
				readOnly: properties.readOnly ? true : undefined,
				required: properties.required ? true : undefined,
				type: 'checkbox',
				value: properties.value
			})
		])
	];
}

registerSuite({
	name: 'Checkbox',

	beforeEach() {
		widget = harness(Checkbox);
	},

	afterEach() {
		widget.destroy();
	},

	simple() {
		widget.expectRender(v('div', {
			classes: widget.classes(css.root)
		}, expectedChildrenRender()));
	},

	'properties and attributes'() {
		const checkboxProperties: CheckboxProperties = {
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

		widget.setProperties(checkboxProperties);

		const parsedLabelClasses = parseLabelClasses(widget.classes(
			css.root,
			css.toggle,
			css.checked,
			css.disabled,
			css.invalid,
			css.readonly,
			css.required
		)());
		widget.resetClasses();
		widget.expectRender(w(Label, {
			extraClasses: { root:
				parsedLabelClasses
			},
			formId: checkboxProperties.formId,
			label: checkboxProperties.label!
		}, expectedChildrenRender(checkboxProperties)));
	},

	'invalid and toggle'() {
		const checkboxProperties = {
			invalid: false,
			mode: Mode.toggle
		};
		widget.setProperties(checkboxProperties);

		widget.expectRender(v('div', {
			classes: widget.classes(css.root, css.toggle, css.valid)
		}, expectedChildrenRender(checkboxProperties)));
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
