import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Radio from '../../Radio';
import * as css from '../../styles/radio.m.css';

registerSuite({
	name: 'Radio',

	construction() {
		const radio = new Radio();
		radio.__setProperties__({
			checked: true
		});

		assert.isTrue(radio.properties.checked);
	},

	'default node attributes'() {
		const radio = new Radio();
		const vnode = <VNode> radio.__render__();
		const inputNode = vnode.children![0].children![0];

		assert.strictEqual(inputNode.vnodeSelector, 'input');
		assert.strictEqual(inputNode.properties!.type, 'radio');
		assert.strictEqual(inputNode.properties!.checked, false);
	},

	'correct node attributes'() {
		const radio = new Radio();
		radio.__setProperties__({
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
		const vnode = <VNode> radio.__render__();
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
		const radio = new Radio();
		radio.__setProperties__({
			checked: true,
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true
		});
		let vnode = <VNode> radio.__render__();

		assert.isTrue(vnode.properties!.classes![css.checked]);
		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);

		radio.__setProperties__({
			checked: false,
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false
		});
		vnode = <VNode> radio.__render__();
		assert.isFalse(vnode.properties!.classes![css.checked]);
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		radio.__setProperties__({
			invalid: undefined
		});
		vnode = <VNode> radio.__render__();
		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
	},

	'focused class'() {
		const radio = new Radio();
		let vnode = <VNode> radio.__render__();

		assert.isUndefined(vnode.properties!.classes![css.focused]);

		(<any> radio)._onFocus(<FocusEvent> {});
		vnode = <VNode> radio.__render__();
		assert.isTrue(vnode.properties!.classes![css.focused]);

		(<any> radio)._onBlur(<FocusEvent> {});
		vnode = <VNode> radio.__render__();
		assert.isFalse(vnode.properties!.classes![css.focused]);
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

		const radio = new Radio();
		radio.__setProperties__({
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

		(<any> radio)._onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		(<any> radio)._onChange(<Event> {});
		assert.isTrue(changed);
		(<any> radio)._onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		(<any> radio)._onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		(<any> radio)._onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		(<any> radio)._onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		(<any> radio)._onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		(<any> radio)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		(<any> radio)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
