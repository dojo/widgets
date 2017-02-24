import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Radio from '../../src/radio/Radio';

registerSuite({
	name: 'Radio',

	construction() {
		const radio = new Radio({
			checked: true
		});

		assert.isTrue(radio.properties.checked);
	},

	'correct node attributes'() {
		const radio = new Radio({});
		let vnode = <VNode> radio.__render__();

		assert.strictEqual(vnode.vnodeSelector, 'input');
		assert.strictEqual(vnode.properties!.type, 'radio');
		assert.isFalse(vnode.properties!.checked);

		radio.setProperties({ checked: true });
		vnode = <VNode> radio.__render__();
		assert.strictEqual(vnode.properties!.checked, 'true');

		radio.setProperties({ checked: false });
		vnode = <VNode> radio.__render__();
		assert.isFalse(vnode.properties!.checked);
	}
});
