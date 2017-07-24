import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Checkbox, { Mode } from '../../Checkbox';
import * as css from '../../styles/checkbox.m.css';

registerSuite({
	name: 'Checkbox',

	construction() {
		const checkbox = new Checkbox();
		checkbox.__setProperties__({
			checked: true
		});

		assert.isTrue(checkbox.properties.checked);
	},

	'default node attributes'() {
		const checkbox = new Checkbox();
		const vnode = <VNode> checkbox.__render__();
		const inputNode = vnode.children![0].children![0];

		assert.strictEqual(inputNode.vnodeSelector, 'input');
		assert.strictEqual(inputNode.properties!.type, 'checkbox');
		assert.strictEqual(inputNode.properties!.checked, false);
	},

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

	'focused class'() {
		const radio = new Checkbox();
		let vnode = <VNode> radio.__render__();

		assert.isUndefined(vnode.properties!.classes![css.focused]);

		(<any> radio)._onFocus(<FocusEvent> {});
		vnode = <VNode> radio.__render__();
		assert.isTrue(vnode.properties!.classes![css.focused]);

		(<any> radio)._onBlur(<FocusEvent> {});
		vnode = <VNode> radio.__render__();
		assert.isFalse(vnode.properties!.classes![css.focused]);
	},

	'toggle attributes'() {
		const checkbox = new Checkbox();
		checkbox.__setProperties__({
			checked: true,
			mode: Mode.toggle,
			offLabel: 'Off',
			onLabel: 'On'
		});
		let vnode = <VNode> checkbox.__render__();

		assert.strictEqual(vnode.children![0].children![0].properties!['aria-hidden'], 'true');
		assert.isNull(vnode.children![0].children![2].properties!['aria-hidden']);

		checkbox.__setProperties__({
			checked: false,
			mode: Mode.toggle,
			offLabel: 'Off',
			onLabel: 'On'
		});
		vnode = <VNode> checkbox.__render__();

		assert.isNull(vnode.children![0].children![0].properties!['aria-hidden']);
		assert.strictEqual(vnode.children![0].children![2].properties!['aria-hidden'], 'true');
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
	}
});
