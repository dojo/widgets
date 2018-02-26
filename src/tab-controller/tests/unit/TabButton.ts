const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { v, w } from '@dojo/widget-core/d';
import harness from '@dojo/test-extras/harness';
import { Keys } from '../../../common/util';
import { assign } from '@dojo/core/lang';

import TabButton, { TabButtonProperties } from '../../TabButton';
import * as css from '../../../theme/tab-controller.m.css';
import { noop, stubEvent } from '../../../common/tests/support/test-helpers';

interface KeyboardEventInit extends EventInit {
	which: number;
}

const props = function(props = {}) {
	return assign({
		controls: 'foo',
		id: 'foo',
		index: 0
	}, props);
};

const testChildren = [
	v('p', ['lorem ipsum']),
	v('a', { href: '#foo'}, [ 'foo' ])
];

const expected = function(closeable = false, disabled = false, activeTab: number = -1, children: any[] = []) {
	children.push(
		closeable ? v('button', {
			tabIndex: activeTab,
			classes: css.close,
			type: 'button',
			onclick: noop
		}, [ 'close' ]) : null
	);

	return v('div', {
		'aria-controls': 'foo',
		'aria-disabled': disabled ? 'true' : 'false',
		'aria-selected': activeTab !== -1 ? 'true' : 'false',
		classes: [
			css.tabButton,
			activeTab !== -1 ? css.activeTabButton : null,
			closeable ? css.closeable : null,
			disabled ? css.disabledTabButton : null
		],
		dir: null,
		id: 'foo',
		key: 'tab-button',
		lang: null,
		onclick: noop,
		onkeydown: noop,
		role: 'tab',
		tabIndex: activeTab
	}, children);
};

registerSuite('TabButton', {

	tests: {
		'default properties'() {
			const h = harness(() => w(TabButton, props()));
			h.expect(expected);
		},

		'custom properties'() {
			const h = harness(() => w(TabButton, props({
				closeable: true,
				disabled: true
			}), testChildren));
			h.expect(() => expected(true, true, -1, testChildren));
		},

		'active tab'() {
			let extraProps: Partial<TabButtonProperties> = {
				active: true
			};
			const h = harness(() => w(TabButton, props(extraProps)));
			h.expect(() => expected(false, false, 0));

			extraProps = {
				active: true,
				closeable: true
			};
			h.expect(() => expected(true, false, 0));
		},

		onCloseClick() {
			const onCloseClick = sinon.stub();
			const stopPropagation = sinon.stub();
			const h = harness(() => w(TabButton, props({
				closeable: true,
				onCloseClick
			})));

			h.trigger('button', 'onclick', { stopPropagation });
			assert.isTrue(onCloseClick.called, 'onCloseClick handler called when close button clicked');
		},

		onClick() {
			const onClick = sinon.stub();
			const stopPropagation = sinon.stub();
			let extraProps: Partial<TabButtonProperties> = {
				onClick
			};
			const h = harness(() => w(TabButton, props(extraProps)));
			h.trigger('@tab-button', 'onclick', { stopPropagation });
			assert.isTrue(onClick.calledOnce, 'onClick handler called when tab is clicked');
			assert.isTrue(onClick.calledWith(0), 'onClick called with index as argument');

			extraProps = {
				disabled: true,
				onClick
			};
			h.trigger('@tab-button', 'onclick', stubEvent);
			assert.isTrue(onClick.calledOnce, 'onClick handler not called when tab is disabled');
		},

		'keyboard navigation'() {
			const onDownArrowPress = sinon.stub();
			const onEndPress = sinon.stub();
			const onHomePress = sinon.stub();
			const onLeftArrowPress = sinon.stub();
			const onRightArrowPress = sinon.stub();
			const onUpArrowPress = sinon.stub();
			const stopPropagation = sinon.stub();
			let extraProps: Partial<TabButtonProperties> = {
				onDownArrowPress,
				onEndPress,
				onHomePress,
				onLeftArrowPress,
				onRightArrowPress,
				onUpArrowPress
			};
			const h = harness(() => w(TabButton, props(extraProps)));
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Down, stopPropagation , ...stubEvent });
			assert.isTrue(onDownArrowPress.calledOnce, 'Down arrow event handler called on down arrow press');
			h.trigger('@tab-button', 'onkeydown', { which: Keys.End, stopPropagation , ...stubEvent });
			assert.isTrue(onEndPress.calledOnce, 'End key event handler called on end key press');
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Home, stopPropagation , ...stubEvent });
			assert.isTrue(onHomePress.calledOnce, 'Home event handler called on home key press');
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Left, stopPropagation , ...stubEvent });
			assert.isTrue(onLeftArrowPress.calledOnce, 'Left arrow event handler called on left arrow press');
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Right, stopPropagation , ...stubEvent });
			assert.isTrue(onRightArrowPress.calledOnce, 'Right arrow event handler called on right arrow press');
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Up, stopPropagation , ...stubEvent });
			assert.isTrue(onUpArrowPress.calledOnce, 'Up arrow event handler called on up arrow press');

			extraProps = {
				disabled: true,
				onDownArrowPress,
				onEndPress,
				onHomePress,
				onLeftArrowPress,
				onRightArrowPress,
				onUpArrowPress
			};
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Down, stopPropagation , ...stubEvent });
			assert.isTrue(onDownArrowPress.calledOnce, 'key handlers not called when tab is disabled');
		},

		'Escape should close tab'() {
			const onCloseClick = sinon.stub();
			const stopPropagation = sinon.stub();
			let extraProps: Partial<TabButtonProperties> = {
				onCloseClick
			};
			const h = harness(() => w(TabButton, props(extraProps)));
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Escape, stopPropagation , ...stubEvent });
			assert.isFalse(onCloseClick.called, 'onCloseClick not called if closeable is false');

			extraProps = {
				closeable: true,
				onCloseClick
			};
			h.trigger('@tab-button', 'onkeydown', { which: Keys.Escape, stopPropagation , ...stubEvent });
			assert.isTrue(onCloseClick.called, 'onCloseClick handler called on escape keydown if closeable');
		},

		'Focus is restored after render'() {
			const onFocusCalled = sinon.stub();
			let extraProps: Partial<TabButtonProperties> = {
				onFocusCalled,
				callFocus: true
			};
			const h = harness(() => w(TabButton, props(extraProps)));
			assert.isTrue(onFocusCalled.calledOnce, 'onFocusCalled called on render if callFocus is true');
			extraProps = {
				callFocus: false,
				onFocusCalled
			};
			h.expect(() => expected(false, false));
			assert.isTrue(onFocusCalled.calledOnce, 'onFocusCalled not called if callFocus is false');
		}
	}
});
