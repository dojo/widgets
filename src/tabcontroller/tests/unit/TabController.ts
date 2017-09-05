import * as registerSuite from 'intern!object';
import * as assert from 'intern/chai!assert';
import * as sinon from 'sinon';

import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import { assignProperties, assignChildProperties, compareProperty } from '@dojo/test-extras/support/d';
import harness, { Harness } from '@dojo/test-extras/harness';
import { assign } from '@dojo/core/lang';

import TabController, { Align, TabControllerProperties } from '../../TabController';
import TabButton from '../../TabButton';
import Tab from '../../Tab';
import * as css from '../../styles/tabController.m.css';

const compareId = compareProperty((value: any) => {
	return typeof value === 'string';
});

const tabChildren = function(number = 2) {
	const tabChildren = [
		w(Tab, {
			key: '0'
		}, [ 'tab content 1' ]),
		w(Tab, {
			closeable: true,
			disabled: true,
			key: '1',
			label: 'foo'
		}, [ 'tab content 2' ])
	];

	if (number > 2) {
		for (let i = 2; i < number; i++) {
			tabChildren.push(w(Tab, {
				key: `${i}`
			}, [ `tab content ${i}` ]));
		}
	}

	return tabChildren;
};

const expectedTabButtons = function(widget: any, empty = false): DNode {
	if (empty) {
		return v('div', {
			key: 'buttons',
			classes: widget.classes(css.tabButtons)
		}, []);
	}

	return v('div', {
		key: 'buttons',
		classes: widget.classes(css.tabButtons)
	}, [
		w(TabButton, {
			callFocus: false,
			active: true,
			closeable: undefined,
			controls: <any> compareId,
			disabled: undefined,
			id: <any> compareId,
			index: 0,
			key: '0-tabbutton',
			onClick: widget.listener,
			onCloseClick: widget.listener,
			onDownArrowPress: widget.listener,
			onEndPress: widget.listener,
			onFocusCalled: widget.listener,
			onHomePress: widget.listener,
			onLeftArrowPress: widget.listener,
			onRightArrowPress: widget.listener,
			onUpArrowPress: widget.listener,
			theme: {}
		}, [ null ]),
		w(TabButton, {
			callFocus: false,
			active: false,
			closeable: true,
			controls: <any> compareId,
			disabled: true,
			id: <any> compareId,
			index: 1,
			key: '1-tabbutton',
			onClick: widget.listener,
			onCloseClick: widget.listener,
			onDownArrowPress: widget.listener,
			onEndPress: widget.listener,
			onFocusCalled: widget.listener,
			onHomePress: widget.listener,
			onLeftArrowPress: widget.listener,
			onRightArrowPress: widget.listener,
			onUpArrowPress: widget.listener,
			theme: {}
		}, [ 'foo' ])
	]);
};

const expectedTabContent = function(widget: any, index = 0): DNode {
	if (index < 0 || index > 1) {
		return null;
	}

	const tabs = [
		w(Tab, {
			key: '0',
			id: <any> compareId,
			labelledBy: <any> compareId
		}, [ 'tab content 1' ]),
		w(Tab, {
			closeable: true,
			disabled: true,
			key: '1',
			label: 'foo',
			id: <any> compareId,
			labelledBy: <any> compareId
		}, [ 'tab content 2' ])
	];
	return v('div', {
		key: 'tabs',
		classes: widget.classes(css.tabs)
	}, [ tabs[index] ]);
};

const expected = function(widget: any, children: DNode[] = []) {
	return v('div', {
		'aria-orientation': 'horizontal',
		classes: widget.classes(css.root),
		role: 'tablist'
	}, children);
};

let widget: Harness<TabControllerProperties, typeof TabController>;

registerSuite({
	name: 'TabController',

	beforeEach() {
		widget = harness(TabController);
	},

	afterEach() {
		widget.destroy();
	},

	'default properties'() {
		widget.setProperties({
			activeIndex: 0
		});
		let tabButtons = expectedTabButtons(widget, true);
		let tabContent = null;

		widget.expectRender(expected(widget, [ tabButtons, tabContent ]), 'Empty tab controller');

		widget.setChildren(tabChildren());
		tabButtons = expectedTabButtons(widget);
		tabContent = expectedTabContent(widget);

		widget.expectRender(expected(widget, [ tabButtons, tabContent ]), 'Tab controller with tabs');
	},

	'custom orientation'() {
		widget.setProperties({
			activeIndex: 0,
			alignButtons: Align.bottom
		});
		widget.setChildren(tabChildren());

		let tabButtons = expectedTabButtons(widget);
		let tabContent = expectedTabContent(widget);
		let expectedVdom = expected(widget, [ tabContent, tabButtons ]);
		assignProperties(expectedVdom, {
			classes: widget.classes(css.alignBottom, css.root)
		});
		widget.expectRender(expectedVdom, 'tabs aligned bottom');

		widget.setProperties({
			activeIndex: 0,
			alignButtons: Align.right
		});
		widget.setChildren(tabChildren());
		tabButtons = expectedTabButtons(widget);
		tabContent = expectedTabContent(widget);
		expectedVdom = expected(widget, [ tabContent, tabButtons ]);
		assignProperties(expectedVdom, {
			'aria-orientation': 'vertical',
			classes: widget.classes(css.alignRight, css.root)
		});
		widget.expectRender(expectedVdom, 'tabs aligned right');

		widget.setProperties({
			activeIndex: 0,
			alignButtons: Align.left
		});
		widget.setChildren(tabChildren());
		tabButtons = expectedTabButtons(widget);
		tabContent = expectedTabContent(widget);
		expectedVdom = expected(widget, [ tabButtons, tabContent ]);
		assignProperties(expectedVdom, {
			'aria-orientation': 'vertical',
			classes: widget.classes(css.alignLeft, css.root)
		});
		widget.expectRender(expectedVdom, 'tabs aligned left');
	},

	'Clicking tab should change activeIndex'() {
		const onRequestTabChange = sinon.stub();
		widget.setProperties({
			activeIndex: 2,
			onRequestTabChange
		});
		widget.setChildren(tabChildren(3));
		widget.callListener('onClick', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledOnce, 'onRequestTabChange called when tab is clicked');
		assert.isTrue(onRequestTabChange.calledWith(0, '0'), 'onRequestTabChange called with correct index and key');

		widget.callListener('onClick', {
			args: [ 1 ],
			key: '1-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledOnce, 'onRequestTabChange not called on disabled tabs');

		widget.callListener('onClick', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledOnce, 'onRequestTabChange not called on the active tab');
	},

	'Closing a tab should change tabs'() {
		const onRequestTabClose = sinon.stub();
		widget.setProperties({
			activeIndex: 2,
			onRequestTabClose
		});
		widget.setChildren(tabChildren(3));

		widget.callListener('onCloseClick', {
			args: [ 2 ],
			key: '2-tabbutton'
		});

		assert.isTrue(onRequestTabClose.calledOnce, 'onRequestTabClose called when a tab\'s onCloseClick fires');
		assert.isTrue(onRequestTabClose.calledWith(2, '2'), 'onRequestTabClose called with correct index and key');
	},

	'Basic keyboard navigation'() {
		const onRequestTabChange = sinon.stub();
		widget.setProperties({
			activeIndex: 2,
			onRequestTabChange
		});
		widget.setChildren(tabChildren(5));

		widget.callListener('onRightArrowPress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(0).args[0], 3, 'Right arrow moves to next tab');

		widget.callListener('onDownArrowPress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledOnce, 'Down arrow does nothing on horizontal tabs');

		widget.callListener('onLeftArrowPress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(1).args[0], 0, 'Left arrow moves to previous tab, skipping disabled tab');

		widget.callListener('onUpArrowPress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledTwice, 'Up arrow does nothing on horizontal tabs');

		widget.callListener('onHomePress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(2).args[0], 0, 'Home moves to first tab');

		widget.callListener('onEndPress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(3).args[0], 4, 'End moves to last tab');
	},

	'Arrow keys wrap to first and last tab'() {
		const onRequestTabChange = sinon.stub();
		widget.setProperties({
			activeIndex: 0,
			onRequestTabChange
		});
		widget.setChildren(tabChildren(3));
		widget.callListener('onLeftArrowPress', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledWith(2), 'Left arrow wraps from first to last tab');

		widget.setProperties({
			activeIndex: 2,
			onRequestTabChange
		});
		widget.getRender();
		widget.callListener('onRightArrowPress', {
			args: [ 2 ],
			key: '2-tabbutton'
		});
		assert.isTrue(onRequestTabChange.calledWith(0), 'Right arrow wraps from last to first tab');
	},

	'Arrow keys on vertical tabs'() {
		const onRequestTabChange = sinon.stub();
		widget.setProperties({
			activeIndex: 0,
			alignButtons: Align.right,
			onRequestTabChange
		});
		widget.setChildren(tabChildren(5));

		widget.callListener('onDownArrowPress', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(0).args[0], 2, 'Down arrow moves to next tab, skipping disabled tab');

		widget.callListener('onRightArrowPress', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(1).args[0], 2, 'Right arrow works on vertical tabs');

		widget.callListener('onUpArrowPress', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(2).args[0], 4, 'Up arrow moves to previous tab');

		widget.callListener('onLeftArrowPress', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(3).args[0], 4, 'Left arrow works on vertical tabs');

		widget.setProperties({
			activeIndex: 0,
			alignButtons: Align.left,
			onRequestTabChange
		});
		widget.getRender();
		widget.callListener('onDownArrowPress', {
			args: [ 0 ],
			key: '0-tabbutton'
		});
		assert.strictEqual(onRequestTabChange.getCall(4).args[0], 2, 'Down arrow works on left-aligned tabs');
	},

	'Should default to last tab if invalid activeIndex passed'() {
		const onRequestTabChange = sinon.stub();
		widget.setProperties({
			activeIndex: 5,
			onRequestTabChange
		});
		widget.setChildren(tabChildren(3));
		widget.getRender();

		assert.isTrue(onRequestTabChange.calledWith(2));
	},

	'Should skip tab if activeIndex is disabled'() {
		const onRequestTabChange = sinon.stub();
		widget.setProperties({
			activeIndex: 1,
			onRequestTabChange
		});
		widget.setChildren(tabChildren(3));
		widget.getRender();

		assert.isTrue(onRequestTabChange.calledWith(2));
	}
});
