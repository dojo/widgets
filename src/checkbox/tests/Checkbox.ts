import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Checkbox from '../../src/checkbox/Checkbox';
import * as css from '../../src/checkbox/styles/checkbox.css';

registerSuite({
	name: 'Checkbox',

	construction() {
		const checkbox = new Checkbox();
		checkbox.setProperties({
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
		checkbox.setProperties({
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
		assert.isTrue(inputNode.properties!['aria-invalid']);
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
		checkbox.setProperties({
			checked: true,
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true
		});
		let vnode = <VNode> checkbox.__render__();

		assert.isTrue(vnode.properties!.classes![css.checked]);
		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);

		checkbox.setProperties({
			checked: false,
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false
		});
		vnode = <VNode> checkbox.__render__();
		assert.isFalse(vnode.properties!.classes![css.checked]);
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		checkbox.setProperties({
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
		checkbox.setProperties({
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

		checkbox.onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		checkbox.onChange(<Event> {});
		assert.isTrue(changed);
		checkbox.onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		checkbox.onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		checkbox.onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		checkbox.onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		checkbox.onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		checkbox.onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		checkbox.onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
