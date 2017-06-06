import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Button from '../../Button';

registerSuite({
	name: 'Button',
	construction() {
		const button = new Button();
		button.__setProperties__({
			content: 'foo',
			name: 'bar'
		});
		assert.strictEqual(button.properties.content, 'foo');
		assert.strictEqual(button.properties.name, 'bar');
	},

	'correct node attributes'() {
		const button = new Button();
		button.__setProperties__({
			content: 'foo',
			type: 'submit',
			name: 'bar',
			id: 'qux',
			disabled: true,
			pressed: true,
			describedBy: 'baz',
			popup: true
		});
		const vnode = <VNode> button.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'button');
		assert.strictEqual(vnode.properties!.innerHTML, 'foo');
		assert.strictEqual(vnode.properties!.type, 'submit');
		assert.strictEqual(vnode.properties!.name, 'bar');
		assert.strictEqual(vnode.properties!.id, 'qux');
		assert.isTrue(vnode.properties!.disabled);
		assert.strictEqual(vnode.properties!['aria-pressed'], 'true');
		assert.strictEqual(vnode.properties!['aria-describedby'], 'baz');
		assert.strictEqual(vnode.properties!['aria-haspopup'], 'true');
		assert.strictEqual(vnode.properties!['aria-controls'], '');
		assert.strictEqual(vnode.properties!['aria-expanded'], 'false');
		assert.lengthOf(vnode.children, 0);
	},

	'button without text'() {
		const button = new Button();
		const vnode = <VNode> button.__render__();
		assert.strictEqual(vnode.properties!.innerHTML, '');
	},

	events() {
		let blurred = false,
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

		const button = new Button();
		button.__setProperties__({
			onBlur: () => { blurred = true; },
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

		(<any> button)._onBlur(<FocusEvent> {});
		assert.isTrue(blurred);
		(<any> button)._onClick(<MouseEvent> {});
		assert.isTrue(clicked);
		(<any> button)._onFocus(<FocusEvent> {});
		assert.isTrue(focused);
		(<any> button)._onKeyDown(<KeyboardEvent> {});
		assert.isTrue(keydown);
		(<any> button)._onKeyPress(<KeyboardEvent> {});
		assert.isTrue(keypress);
		(<any> button)._onKeyUp(<KeyboardEvent> {});
		assert.isTrue(keyup);
		(<any> button)._onMouseDown(<MouseEvent> {});
		assert.isTrue(mousedown);
		(<any> button)._onMouseUp(<MouseEvent> {});
		assert.isTrue(mouseup);
		(<any> button)._onTouchStart(<TouchEvent> {});
		assert.isTrue(touchstart);
		(<any> button)._onTouchEnd(<TouchEvent> {});
		assert.isTrue(touchend);
		(<any> button)._onTouchCancel(<TouchEvent> {});
		assert.isTrue(touchcancel);
	}
});
