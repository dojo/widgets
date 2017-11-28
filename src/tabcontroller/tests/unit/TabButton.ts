const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { v } from '@dojo/widget-core/d';
import { assignProperties, assignChildProperties } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import { Keys } from '../../../common/util';
import { assign } from '@dojo/core/lang';

import TabButton from '../../TabButton';
import * as css from '../../styles/tabController.m.css';

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

const expected = function(widget: any, closeable = false, children: any[] = []) {
	children.push(
		closeable ? v('button', {
			tabIndex: -1,
			classes: css.close,
			innerHTML: 'close tab',
			onclick: widget.listener
		}) : null
	);

	return v('div', {
		'aria-controls': 'foo',
		'aria-disabled': 'false',
		'aria-selected': 'false',
		classes: [ css.tabButton, null, null ],
		dir: null,
		id: 'foo',
		key: 'tab-button',
		lang: null,
		onclick: widget.listener,
		onkeydown: widget.listener,
		role: 'tab',
		tabIndex: -1
	}, children);
};

let widget: Harness<TabButton>;

registerSuite('TabButton', {

	beforeEach() {
		widget = harness(TabButton);
	},

	afterEach() {
		widget.destroy();
	},

	tests: {
		'default properties'() {
			widget.setProperties(props());
			widget.expectRender(expected(widget));
		},

		'custom properties'() {
			widget.setProperties(props({
				closeable: true,
				disabled: true
			}));
			widget.setChildren(testChildren);
			const expectedVdom = expected(widget, true, [...testChildren]);
			assignProperties(expectedVdom, {
				'aria-disabled': 'true',
				classes: [ css.tabButton, null, css.disabledTabButton ]
			});
			widget.expectRender(expectedVdom);
		},

		'active tab'() {
			widget.setProperties(props({
				active: true
			}));
			let expectedVdom = expected(widget);
			assignProperties(expectedVdom, {
				'aria-selected': 'true',
				classes: [ css.tabButton, css.activeTabButton, null ],
				tabIndex: 0
			});
			widget.expectRender(expectedVdom, 'Selected tab render without close button');

			widget.setProperties(props({
				active: true,
				closeable: true
			}));
			expectedVdom = expected(widget, true);
			assignProperties(expectedVdom, {
				'aria-selected': 'true',
				classes: [ css.tabButton, css.activeTabButton, null ],
				tabIndex: 0
			});
			assignChildProperties(expectedVdom, '0', {
				tabIndex: 0
			});
			widget.expectRender(expectedVdom, 'Selected tab render with close button');
		},

		onCloseClick() {
			const onCloseClick = sinon.stub();
			widget.setProperties(props({
				closeable: true,
				onCloseClick
			}));

			widget.sendEvent('click', { selector: 'button' });
			assert.isTrue(onCloseClick.called, 'onCloseClick handler called when close button clicked');
		},

		onClick() {
			const onClick = sinon.stub();
			widget.setProperties(props({ onClick }));
			widget.sendEvent('click');
			assert.isTrue(onClick.calledOnce, 'onClick handler called when tab is clicked');
			assert.isTrue(onClick.calledWith(0), 'onClick called with index as argument');

			widget.setProperties(props({
				disabled: true,
				onClick
			}));
			widget.getRender();
			widget.sendEvent('click');
			assert.isTrue(onClick.calledOnce, 'onClick handler not called when tab is disabled');
		},

		'keyboard navigation'() {
			const onDownArrowPress = sinon.stub();
			const onEndPress = sinon.stub();
			const onHomePress = sinon.stub();
			const onLeftArrowPress = sinon.stub();
			const onRightArrowPress = sinon.stub();
			const onUpArrowPress = sinon.stub();

			widget.setProperties(props({
				onDownArrowPress,
				onEndPress,
				onHomePress,
				onLeftArrowPress,
				onRightArrowPress,
				onUpArrowPress
			}));

			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Down }
			});
			assert.isTrue(onDownArrowPress.calledOnce, 'Down arrow event handler called on down arrow press');
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.End }
			});
			assert.isTrue(onEndPress.calledOnce, 'End key event handler called on end key press');
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Home }
			});
			assert.isTrue(onHomePress.calledOnce, 'Home event handler called on home key press');
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Left }
			});
			assert.isTrue(onLeftArrowPress.calledOnce, 'Left arrow event handler called on left arrow press');
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Right }
			});
			assert.isTrue(onRightArrowPress.calledOnce, 'Right arrow event handler called on right arrow press');
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Up }
			});
			assert.isTrue(onUpArrowPress.calledOnce, 'Up arrow event handler called on up arrow press');

			widget.setProperties(props({
				disabled: true,
				onDownArrowPress,
				onEndPress,
				onHomePress,
				onLeftArrowPress,
				onRightArrowPress,
				onUpArrowPress
			}));
			widget.getRender();
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Down }
			});
			assert.isTrue(onDownArrowPress.calledOnce, 'key handlers not called when tab is disabled');
		},

		'Escape should close tab'() {
			const onCloseClick = sinon.stub();
			widget.setProperties(props({
				onCloseClick
			}));

			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Escape }
			});
			assert.isFalse(onCloseClick.called, 'onCloseClick not called if closeable is false');

			widget.setProperties(props({
				closeable: true,
				onCloseClick
			}));
			widget.getRender();
			widget.sendEvent<KeyboardEventInit>('keydown', {
				eventInit: { which: Keys.Escape }
			});
			assert.isTrue(onCloseClick.called, 'onCloseClick handler called on escape keydown if closeable');
		},

		'Focus is restored after render'() {
			const onFocusCalled = sinon.stub();
			widget.setProperties(props({
				callFocus: true,
				onFocusCalled
			}));
			widget.getRender();
			assert.isTrue(onFocusCalled.calledOnce, 'onFocusCalled called on render if callFocus is true');

			widget.setProperties(props({
				callFocus: false,
				onFocusCalled
			}));
			widget.getRender();
			assert.isTrue(onFocusCalled.calledOnce, 'onFocusCalled not called if callFocus is false');
		}
	}
});
