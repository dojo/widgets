import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TabButton from '../../TabButton';
import * as css from '../../styles/tabPane.css';

registerSuite({
	name: 'TabButton',

	'Closeable tab button should render X'() {
		const tabButton = new TabButton();
		tabButton.setChildren([ 'abc' ]);
		tabButton.setProperties({ closeable: true });
		let vnode = <VNode> tabButton.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Active tab button should render properly'() {
		const tabButton = new TabButton();
		tabButton.setProperties({ active: true });
		let vnode = <VNode> tabButton.__render__();
		assert.property(vnode.properties!.classes!, css.activeTabButton);
	},

	'Disabled tab button should render properly'() {
		const tabButton = new TabButton();
		tabButton.setProperties({ disabled: true });
		let vnode = <VNode> tabButton.__render__();
		assert.property(vnode.properties!.classes!, css.disabledTabButton);
	},

	'Closing tab should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({ onCloseClick: () => called = true });
		(<any> tabButton)._onCloseClick({ stopPropagation() { } });
		assert.isTrue(called);
	},

	'Selecting tab should trigger property'() {
		const tabButton = new TabButton();
		let called = 0;
		tabButton.setProperties({
			onClick: () => called++,
			disabled: true
		});
		(<any> tabButton)._onClick();
		tabButton.setProperties({
			onClick: () => called++,
			disabled: false
		});
		(<any> tabButton)._onClick();
		assert.strictEqual(called, 1);
	}
});
