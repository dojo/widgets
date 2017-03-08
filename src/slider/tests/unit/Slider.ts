import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Slider from '../../Slider';
import * as css from '../../styles/slider.css';

registerSuite({
	name: 'Slider',

	construction() {
		const slider = new Slider();
		slider.setProperties({
			min: 0,
			max: 100,
			value: 50
		});
	},

	'default node attributes'() {
		const slider = new Slider();
		const vnode = <VNode> slider.__render__();
		const inputNode = vnode.children![0].children![0];

		assert.strictEqual(inputNode.vnodeSelector, 'input');
		assert.strictEqual(inputNode.properties!.type, 'range');
	},

	'correct node attributes'() {
		const slider = new Slider();
		slider.setProperties({
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
		const vnode = <VNode> slider.__render__();
		const labelNode = vnode.children![0];
		const inputNode = vnode.children![1].children![0];

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
		const slider = new Slider();
		slider.setProperties({
			disabled: true,
			invalid: true,
			readOnly: true,
			required: true
		});
		let vnode = <VNode> slider.__render__();

		assert.isTrue(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.invalid]);
		assert.isTrue(vnode.properties!.classes![css.readonly]);
		assert.isTrue(vnode.properties!.classes![css.required]);

		slider.setProperties({
			disabled: false,
			invalid: false,
			readOnly: false,
			required: false
		});
		vnode = <VNode> slider.__render__();
		assert.isFalse(vnode.properties!.classes![css.disabled]);
		assert.isTrue(vnode.properties!.classes![css.valid]);
		assert.isFalse(vnode.properties!.classes![css.invalid]);
		assert.isFalse(vnode.properties!.classes![css.readonly]);
		assert.isFalse(vnode.properties!.classes![css.required]);

		slider.setProperties({
			invalid: undefined
		});
		vnode = <VNode> slider.__render__();
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

		const slider = new Slider();
		slider.setProperties({
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

		slider.onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		slider.onChange(<Event> {});
		assert.isTrue(changed);
		slider.onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		slider.onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		slider.onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		slider.onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		slider.onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		slider.onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		slider.onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
