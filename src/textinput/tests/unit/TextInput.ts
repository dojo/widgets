import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
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
		const onBlur = sinon.spy();
		const onChange = sinon.spy();
		const onClick = sinon.spy();
		const onFocus = sinon.spy();
		const onInput = sinon.spy();
		const onKeyDown = sinon.spy();
		const onKeyPress = sinon.spy();
		const onKeyUp = sinon.spy();
		const onMouseDown = sinon.spy();
		const onMouseUp = sinon.spy();
		const onTouchStart = sinon.spy();
		const onTouchEnd = sinon.spy();
		const onTouchCancel = sinon.spy();

		const textInput = new TextInput();
		textInput.__setProperties__({
			onBlur,
			onChange,
			onClick,
			onInput,
			onFocus,
			onKeyDown,
			onKeyPress,
			onKeyUp,
			onMouseDown,
			onMouseUp,
			onTouchStart,
			onTouchEnd,
			onTouchCancel
		});

		(<any> textInput)._onBlur(<FocusEvent> {});
		assert.isTrue(onBlur.called);
		(<any> textInput)._onChange(<Event> {});
		assert.isTrue(onChange.called);
		(<any> textInput)._onClick(<MouseEvent> {});
		assert.isTrue(onClick.called);
		(<any> textInput)._onFocus(<FocusEvent> {});
		assert.isTrue(onFocus.called);
		(<any> textInput)._onInput(<Event> {});
		assert.isTrue(onInput.called);
		(<any> textInput)._onKeyDown(<KeyboardEvent> {});
		assert.isTrue(onKeyDown.called);
		(<any> textInput)._onKeyPress(<KeyboardEvent> {});
		assert.isTrue(onKeyPress.called);
		(<any> textInput)._onKeyUp(<KeyboardEvent> {});
		assert.isTrue(onKeyUp.called);
		(<any> textInput)._onMouseDown(<MouseEvent> {});
		assert.isTrue(onMouseDown.called);
		(<any> textInput)._onMouseUp(<MouseEvent> {});
		assert.isTrue(onMouseUp.called);
		(<any> textInput)._onTouchStart(<TouchEvent> {});
		assert.isTrue(onTouchStart.called);
		(<any> textInput)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(onTouchEnd.called);
		(<any> textInput)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(onTouchCancel.called);
	}
});
