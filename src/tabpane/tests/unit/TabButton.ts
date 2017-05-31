import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import harness, { Harness } from '@dojo/test-extras/harness';
import { HNode } from '@dojo/widget-core/interfaces';
import TabButton, { TabButtonProperties } from '../../TabButton';
import { v } from '@dojo/widget-core/d';
import * as css from '../../styles/tabPane.m.css';
import { assign } from '@dojo/core/lang';

function props(props = {}) {
	return assign({
		controls: 'foo',
		id: 'foo',
		index: 0
	}, props);
}

let tabButton: Harness<TabButtonProperties, typeof TabButton>;

registerSuite({
	name: 'TabButton unit tests',

	beforeEach() {
		tabButton = harness(TabButton);
		tabButton.setChildren([ 'abc' ]);
	},
	afterEach() {
		tabButton.destroy();
	},

	'default render'() {
		tabButton.setProperties(props());
		const expected = v('div', {
			'aria-controls': 'foo',
			'aria-disabled': 'false',
			'aria-selected': 'false',
			classes: tabButton.classes(css.tabButton),
			id: 'foo',
			key: 'tab-button',
			role: 'tab',
			tabIndex: -1,
			onclick: tabButton.listener,
			onkeydown: tabButton.listener,
			afterCreate: tabButton.listener,
			afterUpdate: tabButton.listener
		}, [
			'abc'
		]);
		tabButton.expectRender(expected);
	},
	'closeable tab render'() {
		tabButton.setProperties(props({
			closeable: true,
			active: true
		}));

		const expected = v('div', {
			'aria-controls': 'foo',
			'aria-disabled': 'false',
			'aria-selected': 'true',
			classes: tabButton.classes(css.tabButton, css.activeTabButton),
			id: 'foo',
			key: 'tab-button',
			role: 'tab',
			tabIndex: 0,
			onclick: tabButton.listener,
			onkeydown: tabButton.listener,
			afterCreate: tabButton.listener,
			afterUpdate: tabButton.listener
		}, [
			'abc',
			v('button', {
				tabIndex: 0,
				classes: tabButton.classes(css.close),
				innerHTML: 'close tab',
				onclick: tabButton.listener
			})
		]);
		tabButton.expectRender(expected);
	},
	'Active tab button should render properly'() {
		tabButton.setProperties(props({ active: true }));
		let vnode = <HNode> tabButton.getRender();
		assert.property(vnode.properties!.classes!, css.activeTabButton);
	},
	'Disabled tab button should render properly'() {
		tabButton.setProperties(props({ disabled: true }));
		const vnode = <HNode> tabButton.getRender();
		assert.property(vnode.properties!.classes!, css.disabledTabButton);
	},
	'Closing tab should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onCloseClick: () => called = true,
			closeable: true
		}));
		tabButton.sendEvent('click', { selector: 'button'});
		assert.isTrue(called);
	},
	'Selecting tab should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onClick: () => called = true,
			disabled: true
		}));
		tabButton.sendEvent('click');
		assert.isFalse(called);
		tabButton.setProperties(props({
			onClick: () => called = true,
			disabled: false
		}));
		tabButton.getRender(); // just to trigger a `_invalidate()`
		tabButton.sendEvent('click');
		assert.isTrue(called);
	},
	'Key down should be ignored for disabled tab'() {
		let called = false;
		tabButton.setProperties(props({
			disabled: true,
			onLeftArrowPress: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 37
			}
		});
		assert.isFalse(called);

		tabButton.setProperties(props({
			disabled: false,
			onLeftArrowPress: () => called = true
		}));
		tabButton.getRender(); // just to trigger a `_invalidate()`
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 37
			}
		});
		assert.isTrue(called);
	},
	'Escape should close tab'() {
		let called = false;
		tabButton.setProperties(props({
			closeable: true,
			onCloseClick: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 27
			}
		});
		assert.isTrue(called);
	},
	'Left arrow should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onLeftArrowPress: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 37
			}
		});
		assert.isTrue(called);
	},
	'Up arrow should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onUpArrowPress: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 38
			}
		});
		assert.isTrue(called);
	},
	'Right arrow should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onRightArrowPress: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 39
			}
		});
		assert.isTrue(called);
	},
	'Down arrow should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onDownArrowPress: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 40
			}
		});
		assert.isTrue(called);
	},
	'Home should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onHomePress: () => called = true
		}));

		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 36
			}
		});
		assert.isTrue(called);
	},
	'End should trigger property'() {
		let called = false;
		tabButton.setProperties(props({
			onEndPress: () => called = true
		}));
		tabButton.sendEvent('keydown', {
			eventInit: {
				which: 35
			}
		});
		assert.isTrue(called);
	},
	'Focus is restored after render'() {
		// this test can not be converted using `test-extras`
		const tabButton = new TabButton();
		let focused = 0;
		tabButton.__setProperties__(props({ active: true }));
		(<any> tabButton).onElementCreated({
			focus: () => focused++
		}, 'tab-button');
		(<any> tabButton).onElementUpdated({
			focus: () => focused++
		}, 'tab-button');
		assert.strictEqual(focused, 2);
	}
});
