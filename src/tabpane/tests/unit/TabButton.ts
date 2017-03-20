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
	},

	'Key down should be ignored for disabled tab'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({
			disabled: true,
			onLeftArrowPress: () => called = true
		});
		(<any> tabButton)._onKeyDown({ keyCode: 37 });
		assert.isFalse(called);
	},

	'Escape should close tab'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({
			closeable: true,
			onCloseClick: () => called = true
		});
		(<any> tabButton)._onKeyDown({ keyCode: 27 });
		assert.isTrue(called);
	},

	'Left arrow should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({
			onLeftArrowPress: () => called = true
		});
		(<any> tabButton)._onKeyDown({ keyCode: 37 });
		assert.isTrue(called);
	},

	'Right arrow should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({
			onRightArrowPress: () => called = true
		});
		(<any> tabButton)._onKeyDown({ keyCode: 39 });
		assert.isTrue(called);
	},

	'Home should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({
			onHomePress: () => called = true
		});
		(<any> tabButton)._onKeyDown({ keyCode: 36 });
		assert.isTrue(called);
	},

	'End should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.setProperties({
			onEndPress: () => called = true
		});
		(<any> tabButton)._onKeyDown({ keyCode: 35 });
		assert.isTrue(called);
	},

	'Focus is restored after render'() {
		const tabButton = new TabButton();
		let focused = 0;
		tabButton.setProperties({ active: true });
		(<any> tabButton).onElementCreated({
			focus: () => focused++
		}, 'tab-button');
		(<any> tabButton).onElementUpdated({
			focus: () => focused++
		}, 'tab-button');
		assert.strictEqual(focused, 2);
	}
});
