import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Button from '../../src/button/Button';

registerSuite({
	name: 'Button',
	construction() {
		const button = new Button({
			content: 'foo',
			name: 'bar'
		});
		assert.strictEqual(button.properties.content, 'foo');
		assert.strictEqual(button.properties.name, 'bar');
	},
	'correct node attributes'() {
		const button = new Button({
			content: 'foo',
			type: 'submit',
			icon: 'x',
			name: 'bar',
			disabled: true,
			pressed: true,
			describedBy: 'baz',
			hasPopup: true
		});
		const vnode = <VNode> button.__render__();
		assert.strictEqual(vnode.vnodeSelector, 'button');
		assert.strictEqual(vnode.properties!.innerHTML, 'foo');
		assert.strictEqual(vnode.properties!.type, 'submit');
		assert.strictEqual(vnode.properties!['data-dojo-icon'], 'x');
		assert.strictEqual(vnode.properties!.name, 'bar');
		assert.isTrue(vnode.properties!.disabled);
		assert.strictEqual(vnode.properties!['aria-pressed'], 'true');
		assert.strictEqual(vnode.properties!['aria-describedby'], 'baz');
		assert.strictEqual(vnode.properties!['aria-haspopup'], 'true');
		assert.lengthOf(vnode.children, 0);
	},
	'button without text'() {
		const button = new Button({});
		const vnode = <VNode> button.__render__();
		assert.strictEqual(vnode.properties!.innerHTML, '');
	},
	onClick() {
		let onClickCount = 0;
		const onClick = function() {
			onClickCount++;
		};
		const button = new Button({ onClick });
		button.onClick(<MouseEvent> {});
		assert.equal(onClickCount, 1);
		button.setProperties({});
		button.onClick(<MouseEvent> {});
		assert.equal(onClickCount, 1);
	}
});
