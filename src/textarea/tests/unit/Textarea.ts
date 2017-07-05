import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import { VNode } from '@dojo/interfaces/vdom';
import Textarea from '../../Textarea';
import * as css from '../../styles/textarea.m.css';

registerSuite({
	name: 'Textarea',

	construction() {
		const textarea = new Textarea();
		textarea.__setProperties__({
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

		textarea.__setProperties__({
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
		textarea.__setProperties__({
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

		textarea.__setProperties__({
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

		textarea.__setProperties__({
			invalid: undefined
		});
		vnode = <VNode> textarea.__render__();
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

		const textarea = new Textarea();
		textarea.__setProperties__({
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

		(<any> textarea)._onBlur(<FocusEvent> {});
		assert.isTrue(onBlur.called);
		(<any> textarea)._onChange(<Event> {});
		assert.isTrue(onChange.called);
		(<any> textarea)._onClick(<MouseEvent> {});
		assert.isTrue(onClick.called);
		(<any> textarea)._onFocus(<FocusEvent> {});
		assert.isTrue(onFocus.called);
		(<any> textarea)._onInput(<Event> {});
		assert.isTrue(onInput.called);
		(<any> textarea)._onKeyDown(<KeyboardEvent> {});
		assert.isTrue(onKeyDown.called);
		(<any> textarea)._onKeyPress(<KeyboardEvent> {});
		assert.isTrue(onKeyPress.called);
		(<any> textarea)._onKeyUp(<KeyboardEvent> {});
		assert.isTrue(onKeyUp.called);
		(<any> textarea)._onMouseDown(<MouseEvent> {});
		assert.isTrue(onMouseDown.called);
		(<any> textarea)._onMouseUp(<MouseEvent> {});
		assert.isTrue(onMouseUp.called);
		(<any> textarea)._onTouchStart(<TouchEvent> {});
		assert.isTrue(onTouchStart.called);
		(<any> textarea)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(onTouchEnd.called);
		(<any> textarea)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(onTouchCancel.called);
	}
});
