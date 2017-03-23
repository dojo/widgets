import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Textarea from '../../Textarea';
import * as css from '../../styles/textarea.m.css';

registerSuite({
	name: 'Textarea',

	construction() {
		const textarea = new Textarea();
		textarea.setProperties({
			columns: 30,
			rows: 10,
			wrapText: 'hard',
			placeholder: 'bar',
			value: 'baz'
		});

		assert.strictEqual(textarea.properties.columns, 30);
		assert.strictEqual(textarea.properties.rows, 10);
		assert.strictEqual(textarea.properties.wrapText, 'hard');
		assert.strictEqual(textarea.properties.placeholder, 'bar');
		assert.strictEqual(textarea.properties.value, 'baz');
	},

	'correct node attributes'() {
		const textarea = new Textarea();
		let vnode = <VNode> textarea.__render__();

		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'textarea');
		assert.isUndefined(vnode.properties!.cols);
		assert.isUndefined(vnode.properties!.rows);
		assert.isUndefined(vnode.properties!.wrap);

		textarea.setProperties({
			columns: 30,
			rows: 10,
			wrapText: 'hard',
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			maxLength: 50,
			minLength: 5,
			name: 'bar',
			placeholder: 'baz',
			readOnly: true,
			required: true,
			value: 'qux'
		});
		vnode = <VNode> textarea.__render__();
		const labelNode = vnode.children![0];
		const inputNode = vnode.children![1].children![0];

		assert.strictEqual(inputNode.properties!.cols, '30');
		assert.strictEqual(inputNode.properties!.rows, '10');
		assert.strictEqual(inputNode.properties!.wrap, 'hard');
		assert.strictEqual(inputNode.properties!['aria-describedby'], 'id1');
		assert.isTrue(inputNode.properties!.disabled);
		assert.strictEqual(inputNode.properties!['aria-invalid'], 'true');
		assert.strictEqual(inputNode.properties!.maxlength, '50');
		assert.strictEqual(inputNode.properties!.minlength, '5');
		assert.strictEqual(inputNode.properties!.name, 'bar');
		assert.strictEqual(inputNode.properties!.placeholder, 'baz');
		assert.isTrue(inputNode.properties!.readOnly);
		assert.strictEqual(inputNode.properties!['aria-readonly'], 'true');
		assert.isTrue(inputNode.properties!.required);
		assert.strictEqual(inputNode.properties!.value, 'qux');

		assert.strictEqual(vnode.properties!['form'], 'id2');
		assert.strictEqual(labelNode.properties!.innerHTML, 'foo');
	},

	'state classes'() {
		const textarea = new Textarea();
		textarea.setProperties({
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true
		});
		let vnode = <VNode> textarea.__render__();

		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);

		textarea.setProperties({
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false
		});
		vnode = <VNode> textarea.__render__();
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		textarea.setProperties({
			invalid: undefined
		});
		vnode = <VNode> textarea.__render__();
		assert.isFalse(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
	},

	events() {
		let blurred = false,
				changed = false,
				clicked = false,
				focused = false,
				input = false,
				keydown = false,
				keypress = false,
				keyup = false,
				mousedown = false,
				mouseup = false,
				touchstart = false,
				touchend = false,
				touchcancel = false;

		const textarea = new Textarea();
		textarea.setProperties({
			onBlur: () => { blurred = true; },
			onChange: () => { changed = true; },
			onClick: () => { clicked = true; },
			onFocus: () => { focused = true; },
			onInput: () => { input = true; },
			onKeyDown: () => { keydown = true; },
			onKeyPress: () => { keypress = true; },
			onKeyUp: () => { keyup = true; },
			onMouseDown: () => { mousedown = true; },
			onMouseUp: () => { mouseup = true; },
			onTouchStart: () => { touchstart = true; },
			onTouchEnd: () => { touchend = true; },
			onTouchCancel: () => { touchcancel = true; }
		});

		(<any> textarea)._onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		(<any> textarea)._onChange(<Event> {});
		assert.isTrue(changed);
		(<any> textarea)._onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		(<any> textarea)._onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		(<any> textarea)._onInput(<Event> {});
		assert.isTrue(input);
		(<any> textarea)._onKeyDown(<KeyboardEvent> {});
		assert.isTrue(keydown);
		(<any> textarea)._onKeyPress(<KeyboardEvent> {});
		assert.isTrue(keypress);
		(<any> textarea)._onKeyUp(<KeyboardEvent> {});
		assert.isTrue(keyup);
		(<any> textarea)._onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		(<any> textarea)._onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		(<any> textarea)._onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		(<any> textarea)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		(<any> textarea)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
