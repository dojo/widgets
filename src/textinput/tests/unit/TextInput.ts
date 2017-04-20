import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TextInput from '../../TextInput';
import * as css from '../../styles/textinput.m.css';

registerSuite({
	name: 'TextInput',

	construction() {
		const textinput = new TextInput();
		textinput.__setProperties__({
			type: 'text',
			placeholder: 'bar',
			value: 'baz'
		});

		assert.strictEqual(textinput.properties.type, 'text');
		assert.strictEqual(textinput.properties.placeholder, 'bar');
		assert.strictEqual(textinput.properties.value, 'baz');
	},

	'default node attributes'() {
		const textinput = new TextInput();
		let vnode = <VNode> textinput.__render__();

		assert.strictEqual(vnode.children![0].children![0].vnodeSelector, 'input');
		assert.strictEqual(vnode.children![0].children![0].properties!.type, 'text');

		textinput.__setProperties__({
			type: 'email'
		});
		vnode = <VNode> textinput.__render__();

		assert.strictEqual(vnode.children![0].children![0].properties!.type, 'email');
	},

	'correct node attributes'() {
		const textinput = new TextInput();
		textinput.__setProperties__({
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
			type: 'number',
			value: 'qux'
		});
		const vnode = <VNode> textinput.__render__();
		const labelNode = vnode.children![0];
		const inputNode = vnode.children![1].children![0];

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
		assert.strictEqual(inputNode.properties!.type, 'number');
		assert.strictEqual(inputNode.properties!.value, 'qux');

		assert.strictEqual(vnode.properties!['form'], 'id2');
		assert.strictEqual(labelNode.properties!.innerHTML, 'foo');
	},

	'invalid state'() {
		const textinput = new TextInput();
		textinput.__setProperties__({
			label: 'foo',
			invalid: true
		});
		let vnode = <VNode> textinput.__render__();

		assert.isTrue(vnode.properties!.classes![css.invalid]);

		textinput.__setProperties__({
			label: 'foo',
			invalid: false
		});
		vnode = <VNode> textinput.__render__();
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);

		textinput.__setProperties__({
			label: 'foo',
			invalid: undefined
		});
		vnode = <VNode> textinput.__render__();
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

		const textinput = new TextInput();
		textinput.__setProperties__({
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

		(<any> textinput)._onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		(<any> textinput)._onChange(<Event> {});
		assert.isTrue(changed);
		(<any> textinput)._onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		(<any> textinput)._onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		(<any> textinput)._onInput(<Event> {});
		assert.isTrue(input);
		(<any> textinput)._onKeyDown(<KeyboardEvent> {});
		assert.isTrue(keydown);
		(<any> textinput)._onKeyPress(<KeyboardEvent> {});
		assert.isTrue(keypress);
		(<any> textinput)._onKeyUp(<KeyboardEvent> {});
		assert.isTrue(keyup);
		(<any> textinput)._onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		(<any> textinput)._onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		(<any> textinput)._onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		(<any> textinput)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		(<any> textinput)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
