import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import Tab from '../../Tab';
import * as css from '../../styles/tabPane.css';

registerSuite({
	name: 'Tab',

	'Loading tab should render'() {
		const tab = new Tab();
		tab.setProperties({
			loading: true
		});
		const vnode = <VNode> tab.__render__();
		assert.property(vnode.properties!.classes!, css.loading);
	},

	'Content should render'() {
		const tab = new Tab();
		tab.setChildren([ 'abc' ]);
		const vnode = <VNode> tab.__render__();
		assert.strictEqual(vnode.text, 'abc');
	}
});
