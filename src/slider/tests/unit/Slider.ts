import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { v } from '@dojo/widget-core/d';
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

		slider.setProperties({
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
		slider.setProperties({
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

		slider.setProperties({
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
		slider.setProperties({
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

		slider.setProperties({
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
				input = false,
				keydown = false,
				keypress = false,
				keyup = false,
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

		slider.onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		slider.onChange(<Event> {});
		assert.isTrue(changed);
		slider.onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		slider.onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		slider.onInput(<Event> {});
		assert.isTrue(input);
		slider.onKeyDown(<KeyboardEvent> {});
		assert.isTrue(keydown);
		slider.onKeyPress(<KeyboardEvent> {});
		assert.isTrue(keypress);
		slider.onKeyUp(<KeyboardEvent> {});
		assert.isTrue(keyup);
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
