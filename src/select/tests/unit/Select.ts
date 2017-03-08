import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Select from '../../Select';
import * as css from '../../styles/select.css';

registerSuite({
	name: 'Select',

	'default node attributes'() {
		const select = new Select();
		let vnode = <VNode> select.__render__();

		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'select');
		assert.strictEqual(vnode.children![0].children!.length, 2);
		assert.strictEqual(vnode.children![0].children![0].children!.length, 0);
	},

	'correct node attributes'() {
		const select = new Select();
		select.setProperties({
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			name: 'bar',
			options: {
				'one': 'One',
				'two': 'Two'
			},
			readOnly: true,
			required: true,
			value: 'one'
		});
		const vnode = <VNode> select.__render__();
		const labelNode = vnode.children![0];
		const selectNode = vnode.children![1].children![0];

		// select props
		assert.strictEqual(selectNode.properties!['aria-describedby'], 'id1');
		assert.isTrue(selectNode.properties!.disabled);
		assert.strictEqual(selectNode.properties!['aria-invalid'], 'true');
		assert.strictEqual(selectNode.properties!.name, 'bar');
		assert.isTrue(selectNode.properties!.readOnly);
		assert.strictEqual(selectNode.properties!['aria-readonly'], 'true');
		assert.isTrue(selectNode.properties!.required);
		assert.strictEqual(selectNode.properties!.value, 'one');

		// options
		assert.strictEqual(selectNode.children!.length, 2);
		assert.strictEqual(selectNode.children![0].properties!.innerHTML, 'One');
		assert.strictEqual(selectNode.children![0].properties!.value, 'one');

		// label props
		assert.strictEqual(vnode.properties!['form'], 'id2');
		assert.strictEqual(labelNode.properties!.innerHTML, 'foo');
	},

	'state classes'() {
		const select = new Select();
		select.setProperties({
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true
		});
		let vnode = <VNode> select.__render__();

		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);

		select.setProperties({
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false
		});
		vnode = <VNode> select.__render__();
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		select.setProperties({
			invalid: undefined
		});
		vnode = <VNode> select.__render__();
		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
	},

	events() {
		let blurred = false,
				changed = false,
				clicked = false,
				focused = false,
				keydown = false,
				keypress = false,
				keyup = false,
				mousedown = false,
				mouseup = false,
				touchstart = false,
				touchend = false,
				touchcancel = false;

		const select = new Select();
		select.setProperties({
			onBlur: () => { blurred = true; },
			onChange: () => { changed = true; },
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
		});

		select.onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		select.onChange(<Event> {});
		assert.isTrue(changed);
		select.onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		select.onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		select.onKeyDown(<KeyboardEvent> {});
		assert.isTrue(keydown);
		select.onKeyPress(<KeyboardEvent> {});
		assert.isTrue(keypress);
		select.onKeyUp(<KeyboardEvent> {});
		assert.isTrue(keyup);
		select.onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		select.onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		select.onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		select.onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		select.onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
