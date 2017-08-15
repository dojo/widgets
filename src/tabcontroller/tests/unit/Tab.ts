import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Tab from '../../Tab';

registerSuite({
	name: 'Tab',

	'Content should render'() {
		const tab = new Tab();
		tab.__setChildren__([ 'abc' ]);
		const vnode = <VNode> tab.__render__();
		assert.strictEqual(vnode.text, 'abc');
	}
});
