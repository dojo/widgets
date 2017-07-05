import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';
import { VNode } from '@dojo/interfaces/vdom';
import TabButton from '../../TabButton';
import * as css from '../../styles/tabPane.m.css';
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
		const onCloseClick = sinon.spy();
		tabButton.__setProperties__(props({ onCloseClick }));
		(<any> tabButton)._onCloseClick({ stopPropagation() { } });
		assert.isTrue(onCloseClick.called);
	},

	'Selecting tab should trigger property'() {
		const tabButton = new TabButton();
		const onClick = sinon.spy();
		tabButton.__setProperties__(props({
			onClick,
			disabled: true
		}));
		(<any> tabButton)._onClick();
		tabButton.__setProperties__(props({
			onClick,
			disabled: false
		}));
		(<any> tabButton)._onClick();
		assert.isTrue(onClick.calledOnce);
	},

	'Key down should be ignored for disabled tab'() {
		const tabButton = new TabButton();
		const onLeftArrowPress = sinon.spy();
		tabButton.__setProperties__(props({
			disabled: true,
			onLeftArrowPress
		}));
		(<any> tabButton)._onKeyDown({ which: 37 });
		assert.isFalse(onLeftArrowPress.called);
	},

	'Escape should close tab'() {
		const tabButton = new TabButton();
		const onCloseClick = sinon.spy();
		tabButton.__setProperties__(props({
			closeable: true,
			onCloseClick
		}));
		<VNode> tabButton.__render__();
		(<any> tabButton)._onKeyDown({ which: 27 });
		assert.isTrue(onCloseClick.called);
	},

	'Left arrow should trigger property'() {
		const tabButton = new TabButton();
		const onLeftArrowPress = sinon.spy();
		tabButton.__setProperties__(props({
			onLeftArrowPress
		}));
		(<any> tabButton)._onKeyDown({ which: 37 });
		assert.isTrue(onLeftArrowPress.called);
	},

	'Up arrow should trigger property'() {
		const tabButton = new TabButton();
		const onUpArrowPress = sinon.spy();
		tabButton.__setProperties__(props({
			onUpArrowPress
		}));
		(<any> tabButton)._onKeyDown({ which: 38 });
		assert.isTrue(onUpArrowPress.called);
	},

	'Right arrow should trigger property'() {
		const tabButton = new TabButton();
		const onRightArrowPress = sinon.spy();
		tabButton.__setProperties__(props({
			onRightArrowPress
		}));
		(<any> tabButton)._onKeyDown({ which: 39 });
		assert.isTrue(onRightArrowPress.called);
	},

	'Down arrow should trigger property'() {
		const tabButton = new TabButton();
		const onDownArrowPress = sinon.spy();
		tabButton.__setProperties__(props({
			onDownArrowPress
		}));
		(<any> tabButton)._onKeyDown({ which: 40 });
		assert.isTrue(onDownArrowPress.called);
	},

	'Home should trigger property'() {
		const tabButton = new TabButton();
		const onHomePress = sinon.spy();
		tabButton.__setProperties__(props({
			onHomePress
		}));
		(<any> tabButton)._onKeyDown({ which: 36 });
		assert.isTrue(onHomePress.called);
	},

	'End should trigger property'() {
		const tabButton = new TabButton();
		const onEndPress = sinon.spy();
		tabButton.__setProperties__(props({
			onEndPress
		}));
		(<any> tabButton)._onKeyDown({ which: 35 });
		assert.isTrue(onEndPress.called);
	},

	'Focus is restored after render'() {
		const tabButton = new TabButton();
		const focus = sinon.spy();
		const onFocusCalled = sinon.spy();
		tabButton.__setProperties__(props({ callFocus: true }));
		(<any> tabButton).onElementCreated({
			focus
		}, 'tab-button');
		tabButton.__setProperties__(props({
			callFocus: true,
			onFocusCalled
		}));
		(<any> tabButton).onElementUpdated({
			focus
		}, 'tab-button');
		assert.isTrue(focus.calledTwice);
		assert.isTrue(onFocusCalled.calledOnce);

		tabButton.__setProperties__(props({
			callFocus: false,
			onFocusCalled
		}));

		(<any> tabButton).onElementUpdated({
			focus
		}, 'tab-button');
		assert.isTrue(focus.calledTwice, 'Focus isn\'t called when properties.callFocus is false');
		assert.isFalse(onFocusCalled.calledTwice);
	}
});
