import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import { VNode } from '@dojo/interfaces/vdom';
import TabButton from '../../TabButton';
import * as css from '../../styles/tabController.m.css';
import { assign } from '@dojo/core/lang';

function props(props = {}) {
	return assign({
		controls: 'foo',
		id: 'foo',
		index: 0
	}, props);
}

registerSuite({
	name: 'TabButton',

	'Closeable tab button should render X'() {
		const tabButton = new TabButton();
		tabButton.__setChildren__([ 'abc' ]);
		tabButton.__setProperties__(props({
			closeable: true,
			active: true
		}));
		let vnode = <VNode> tabButton.__render__();
		assert.lengthOf(vnode.children, 2);
	},

	'Active tab button should render properly'() {
		const tabButton = new TabButton();
		tabButton.__setProperties__(props({ active: true }));
		let vnode = <VNode> tabButton.__render__();
		assert.property(vnode.properties!.classes!, css.activeTabButton);
	},

	'Disabled tab button should render properly'() {
		const tabButton = new TabButton();
		tabButton.__setProperties__(props({ disabled: true }));
		let vnode = <VNode> tabButton.__render__();
		assert.property(vnode.properties!.classes!, css.disabledTabButton);
	},

	'Closing tab should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({ onCloseClick: () => called = true }));
		(<any> tabButton)._onCloseClick({ stopPropagation() { } });
		assert.isTrue(called);
	},

	'Selecting tab should trigger property'() {
		const tabButton = new TabButton();
		let called = 0;
		tabButton.__setProperties__(props({
			onClick: () => called++,
			disabled: true
		}));
		(<any> tabButton)._onClick();
		tabButton.__setProperties__(props({
			onClick: () => called++,
			disabled: false
		}));
		(<any> tabButton)._onClick();
		assert.strictEqual(called, 1);
	},

	'Key down should be ignored for disabled tab'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			disabled: true,
			onLeftArrowPress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 37 });
		assert.isFalse(called);
	},

	'Escape should close tab'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			closeable: true,
			onCloseClick: () => called = true
		}));
		<VNode> tabButton.__render__();
		(<any> tabButton)._onKeyDown({ which: 27 });
		assert.isTrue(called);
	},

	'Left arrow should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			onLeftArrowPress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 37 });
		assert.isTrue(called);
	},

	'Up arrow should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			onUpArrowPress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 38 });
		assert.isTrue(called);
	},

	'Right arrow should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			onRightArrowPress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 39 });
		assert.isTrue(called);
	},

	'Down arrow should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			onDownArrowPress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 40 });
		assert.isTrue(called);
	},

	'Home should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			onHomePress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 36 });
		assert.isTrue(called);
	},

	'End should trigger property'() {
		const tabButton = new TabButton();
		let called = false;
		tabButton.__setProperties__(props({
			onEndPress: () => called = true
		}));
		(<any> tabButton)._onKeyDown({ which: 35 });
		assert.isTrue(called);
	},

	'Focus is restored after render'() {
		const tabButton = new TabButton();
		let focused = 0;
		let focusCallback = false;
		tabButton.__setProperties__(props({ callFocus: true }));
		(<any> tabButton).onElementCreated({
			focus: () => focused++
		}, 'tab-button');
		tabButton.__setProperties__(props({
			callFocus: true,
			onFocusCalled: () => { focusCallback = true; }
		}));
		(<any> tabButton).onElementUpdated({
			focus: () => focused++
		}, 'tab-button');
		assert.strictEqual(focused, 2);
		assert.isTrue(focusCallback);

		focusCallback = false;
		tabButton.__setProperties__(props({
			callFocus: false,
			onFocusCalled: () => { focusCallback = true; }
		}));

		(<any> tabButton).onElementUpdated({
			focus: () => focused++
		}, 'tab-button');
		assert.strictEqual(focused, 2, 'Focus isn\'t called when properties.callFocus is false');
		assert.isFalse(focusCallback);
	}
});
