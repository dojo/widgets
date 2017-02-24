import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Checkbox from '../../src/checkbox/Checkbox';

registerSuite({
	name: 'Checkbox',

	construction() {
		const checkbox = new Checkbox({
			checked: true
		});

		assert.isTrue(checkbox.properties.checked);
	},

	'correct node attributes'() {
		const checkbox = new Checkbox({});
		let vnode = <VNode> checkbox.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'input');
		assert.strictEqual(vnode.properties!.type, 'checkbox');
		assert.isFalse(vnode.properties!.checked);

		checkbox.setProperties({ checked: true });
		vnode = <VNode> checkbox.__render__();
		assert.strictEqual(vnode.properties!.checked, 'true');

		checkbox.setProperties({ checked: false });
		vnode = <VNode> checkbox.__render__();
		assert.isFalse(vnode.properties!.checked);
	}
});
