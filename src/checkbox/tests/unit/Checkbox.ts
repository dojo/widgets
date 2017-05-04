import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';

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

	render() {
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
		const checkbox = new Checkbox();
		const checkboxProperties: CheckboxProperties = {
			describedBy: 'id1',
			bind: widget,
			checked: true,
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			mode: Mode.toggle,
			offLabel: 'Off',
			onLabel: 'On',
			name: 'bar',
			readOnly: true,
			required: true,
			value: 'qux'
		};
		const children: HNode[] = [
			v('div', {
				classes: widget.classes(css.inputWrapper)
			}, [
				v('div', { classes: widget.classes(css.onLabel) }, [ checkboxProperties.onLabel! ]),
				v('div', { classes: widget.classes(css.offLabel) }, [ checkboxProperties.onLabel! ]),
				v('input', {
					'aria-describedby': checkboxProperties.describedBy,
					'aria-invalid': checkboxProperties.invalid,
					'aria-readonly': checkboxProperties.readOnly,
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
		widget.setChildren(children);

		widget.expectRender(w<LabelProperties>(Label, {
			classes: checkbox.classes(css.root, css.toggle, css.checked, css.disabled, css.invalid, css.readonly, css.required),
			formId: checkboxProperties.formId,
			label: checkboxProperties.label!
		}, children));
	}/*,

	'correct node attributes'() {
		const checkbox = new Checkbox();
		checkbox.__setProperties__({
			checked: true,
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			name: 'bar',
			readOnly: true,
			required: true,
			value: 'qux'
		});
		const vnode = <VNode> checkbox.__render__();
		const labelNode = vnode.children![0];
		const inputNode = vnode.children![1].children![0];

		assert.isTrue(inputNode.properties!.checked);
		assert.strictEqual(inputNode.properties!['aria-describedby'], 'id1');
		assert.isTrue(inputNode.properties!.disabled);
		assert.strictEqual(inputNode.properties!['aria-invalid'], 'true');
		assert.strictEqual(inputNode.properties!.name, 'bar');
		assert.isTrue(inputNode.properties!.readOnly);
		assert.strictEqual(inputNode.properties!['aria-readonly'], 'true');
		assert.isTrue(inputNode.properties!.required);
		assert.strictEqual(inputNode.properties!.value, 'qux');

		assert.strictEqual(vnode.properties!['form'], 'id2');
		assert.strictEqual(labelNode.properties!.innerHTML, 'foo');
	},

	'state classes'() {
		const checkbox = new Checkbox();
		checkbox.__setProperties__({
			checked: true,
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true,
			mode: Mode.toggle,
			offLabel: 'Off',
			onLabel: 'On'
		});
		let vnode = <VNode> checkbox.__render__();

		assert.isTrue(vnode.properties!.classes![css.checked]);
		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);
		assert.isTrue(vnode.properties!.classes![css.toggle]);

		checkbox.__setProperties__({
			checked: false,
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false,
			mode: Mode.toggle,
			onLabel: null,
			offLabel: null
		});
		vnode = <VNode> checkbox.__render__();
		assert.isFalse(vnode.properties!.classes![css.checked]);
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		checkbox.__setProperties__({
			invalid: undefined
		});
		vnode = <VNode> checkbox.__render__();
		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
	},

	events() {
		let blurred = false,
				changed = false,
				clicked = false,
				focused = false,
				mousedown = false,
				mouseup = false,
				touchstart = false,
				touchend = false,
				touchcancel = false;

		const checkbox = new Checkbox();
		checkbox.__setProperties__({
			onBlur: () => { blurred = true; },
			onChange: () => { changed = true; },
			onClick: () => { clicked = true; },
			onFocus: () => { focused = true; },
			onMouseDown: () => { mousedown = true; },
			onMouseUp: () => { mouseup = true; },
			onTouchStart: () => { touchstart = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchCancel: () => { touchcancel = true; }
		});

		(<any> checkbox)._onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		(<any> checkbox)._onChange(<Event> {});
		assert.isTrue(changed);
		(<any> checkbox)._onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		(<any> checkbox)._onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		(<any> checkbox)._onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		(<any> checkbox)._onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		(<any> checkbox)._onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		(<any> checkbox)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		(<any> checkbox)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}*/
});
