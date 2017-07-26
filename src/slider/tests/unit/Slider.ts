import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import { v } from '@dojo/widget-core/d';
import { VNode } from '@dojo/interfaces/vdom';
import Slider from '../../Slider';
import * as css from '../../styles/slider.m.css';

registerSuite({
	name: 'Slider',

	construction() {
		const slider = new Slider();
		slider.__setProperties__({
			min: 0,
			max: 100,
			value: 50
		});

		assert.strictEqual(slider.properties.min, 0);
		assert.strictEqual(slider.properties.max, 100);
		assert.strictEqual(slider.properties.value, 50);
	},

	'default node attributes'() {
		const slider = new Slider();
		let vnode = <VNode> slider.__render__();
		let inputNode = vnode.children![0].children![0];

		assert.strictEqual(inputNode.vnodeSelector, 'input');
		assert.strictEqual(inputNode.properties!.type, 'range');
		assert.strictEqual(inputNode.properties!.min, '0');
		assert.strictEqual(inputNode.properties!.max, '100');
		assert.strictEqual(inputNode.properties!.step, '1');
		assert.strictEqual(inputNode.properties!.value, '0');

		slider.__setProperties__({
			min: 20,
			vertical: true
		});
		vnode = <VNode> slider.__render__();
		inputNode = vnode.children![0].children![0];

		assert.strictEqual(inputNode.properties!.value, '20');
		assert.strictEqual(inputNode.properties!.styles!.width, '200px');
		assert.strictEqual(vnode.children![0].children![1].properties!.styles!.width, '200px');
		assert.strictEqual(vnode.children![0].properties!.styles!.height, '200px');
		assert.isTrue(vnode.properties!.classes![css.vertical]);
	},

	'correct node attributes'() {
		const slider = new Slider();
		slider.__setProperties__({
			describedBy: 'id1',
			disabled: true,
			formId: 'id2',
			invalid: true,
			label: 'foo',
			max: 6,
			min: 0,
			name: 'bar',
			output: () => v('span', { innerHTML: 'baz'}),
			readOnly: true,
			required: true,
			step: 2,
			value: 4
		});
		let vnode = <VNode> slider.__render__();
		const labelNode = vnode.children![0];
		const inputNode = vnode.children![1].children![0];
		const outputNode = vnode.children![1].children![2];

		assert.strictEqual(inputNode.properties!['aria-describedby'], 'id1');
		assert.isTrue(inputNode.properties!.disabled);
		assert.strictEqual(inputNode.properties!['aria-invalid'], 'true');
		assert.strictEqual(inputNode.properties!.max, '6');
		assert.strictEqual(inputNode.properties!.min, '0');
		assert.strictEqual(inputNode.properties!.name, 'bar');
		assert.isTrue(inputNode.properties!.readOnly);
		assert.strictEqual(inputNode.properties!['aria-readonly'], 'true');
		assert.isTrue(inputNode.properties!.required);
		assert.strictEqual(inputNode.properties!.step, '2');
		assert.strictEqual(inputNode.properties!.value, '4');
		assert.strictEqual(outputNode.children![0].properties!.innerHTML, 'baz');

		assert.strictEqual(vnode.properties!['form'], 'id2');
		assert.strictEqual(labelNode.properties!.innerHTML, 'foo');

		slider.__setProperties__({
			vertical: true,
			verticalHeight: '100px'
		});
		vnode = <VNode> slider.__render__();
		assert.strictEqual(vnode.children![0].children![0].properties!.styles!.width, '100px');
		assert.strictEqual(vnode.children![0].children![1].properties!.styles!.width, '100px');
		assert.strictEqual(vnode.children![0].properties!.styles!.height, '100px');
	},

	'state classes'() {
		const slider = new Slider();
		slider.__setProperties__({
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true,
			vertical: true
		});
		let vnode = <VNode> slider.__render__();

		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);
		assert.isTrue(vnode.properties!.classes![css.vertical]);

		slider.__setProperties__({
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false,
			vertical: false
		});
		vnode = <VNode> slider.__render__();
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);
		assert.isFalse(vnode.properties!.classes![css.vertical]);

		slider.__setProperties__({
			invalid: undefined
		});
		vnode = <VNode> slider.__render__();
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

		const slider = new Slider();
		slider.__setProperties__({
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

		(<any> slider)._onBlur(<FocusEvent> {});
		assert.isTrue(onBlur.called);
		(<any> slider)._onChange(<Event> {});
		assert.isTrue(onChange.called);
		(<any> slider)._onClick(<MouseEvent> {});
		assert.isTrue(onClick.called);
		(<any> slider)._onFocus(<FocusEvent> {});
		assert.isTrue(onFocus.called);
		(<any> slider)._onInput(<Event> {});
		assert.isTrue(onInput.called);
		(<any> slider)._onKeyDown(<KeyboardEvent> {});
		assert.isTrue(onKeyDown.called);
		(<any> slider)._onKeyPress(<KeyboardEvent> {});
		assert.isTrue(onKeyPress.called);
		(<any> slider)._onKeyUp(<KeyboardEvent> {});
		assert.isTrue(onKeyUp.called);
		(<any> slider)._onMouseDown(<MouseEvent> {});
		assert.isTrue(onMouseDown.called);
		(<any> slider)._onMouseUp(<MouseEvent> {});
		assert.isTrue(onMouseUp.called);
		(<any> slider)._onTouchStart(<TouchEvent> {});
		assert.isTrue(onTouchStart.called);
		(<any> slider)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(onTouchEnd.called);
		(<any> slider)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(onTouchCancel.called);
	}
});
