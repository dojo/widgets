const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';

import TabController, { Align } from '../../index';
import TabButton from '../../TabButton';
import Tab from '../../../tab/index';
import * as css from '../../../theme/tab-controller.m.css';
import {
	createHarness,
	compareId,
	compareWidgetId,
	isFocusedComparator,
	isStringComparator,
	noop
} from '../../../common/tests/support/test-helpers';

const compareLabelledBy = { selector: '*', property: 'labelledBy', comparator: isStringComparator };
const compareControls = { selector: '*', property: 'controls', comparator: isStringComparator };
const harness = createHarness([compareId, compareWidgetId, compareControls, compareLabelledBy]);

const tabChildren = function(tabs = 2) {
	const children = [
		w(
			Tab,
			{
				key: '0'
			},
			['tab content 1']
		),
		w(
			Tab,
			{
				closeable: true,
				disabled: true,
				key: '1',
				label: 'foo'
			},
			['tab content 2']
		)
	];

	if (tabs > 2) {
		for (let i = 2; i < tabs; i++) {
			children.push(
				w(
					Tab,
					{
						key: `${i}`
					},
					[`tab content ${i}`]
				)
			);
		}
	}

	return children;
};

const expectedTabButtons = function(empty = false, activeIndex = 0): DNode {
	if (empty) {
		return v(
			'div',
			{
				key: 'buttons',
				classes: css.tabButtons
			},
			[]
		);
	}

	return v(
		'div',
		{
			key: 'buttons',
			classes: css.tabButtons
		},
		[
			w(
				TabButton,
				{
					active: activeIndex === 0,
					closeable: undefined,
					controls: '',
					disabled: undefined,
					id: '',
					index: 0,
					focus: noop,
					key: '0-tabbutton',
					onClick: noop,
					onCloseClick: noop,
					onDownArrowPress: noop,
					onEndPress: noop,
					onHomePress: noop,
					onLeftArrowPress: noop,
					onRightArrowPress: noop,
					onUpArrowPress: noop,
					theme: undefined,
					classes: undefined
				},
				[null]
			),
			w(
				TabButton,
				{
					active: activeIndex === 1,
					closeable: true,
					controls: '',
					disabled: true,
					id: '',
					index: 1,
					focus: noop,
					key: '1-tabbutton',
					onClick: noop,
					onCloseClick: noop,
					onDownArrowPress: noop,
					onEndPress: noop,
					onHomePress: noop,
					onLeftArrowPress: noop,
					onRightArrowPress: noop,
					onUpArrowPress: noop,
					theme: undefined,
					classes: undefined
				},
				['foo']
			)
		]
	);
};

const expectedTabContent = function(index = 0): DNode {
	if (index < 0 || index > 1) {
		return null;
	}

	const tabs = [
		w(
			Tab,
			{
				key: '0',
				id: '',
				labelledBy: '',
				show: index === 0
			},
			['tab content 1']
		),
		w(
			Tab,
			{
				closeable: true,
				disabled: true,
				key: '1',
				label: 'foo',
				id: '',
				show: index === 1,
				labelledBy: ''
			},
			['tab content 2']
		)
	];
	return v(
		'div',
		{
			key: 'tabs',
			classes: css.tabs
		},
		tabs
	);
};

const expected = function(
	children: DNode[] = [],
	describedby = '',
	classes = [null, css.root],
	vertical = false
) {
	const overrides = describedby
		? {
				'aria-describedby': describedby
		  }
		: null;
	return v(
		'div',
		{
			'aria-orientation': vertical ? 'vertical' : 'horizontal',
			classes,
			role: 'tablist',
			...overrides
		},
		children
	);
};

registerSuite('TabController', {
	tests: {
		'default properties'() {
			let children: any[] = [];
			const h = harness(() =>
				w(
					TabController,
					{
						activeIndex: 0
					},
					children
				)
			);
			let tabButtons = expectedTabButtons(true);
			let tabContent: any = null;

			h.expect(() => expected([tabButtons, tabContent]));
			children = tabChildren();
			tabButtons = expectedTabButtons();
			tabContent = expectedTabContent();
			h.expect(() => expected([tabButtons, tabContent]));
		},

		'aria properties'() {
			const h = harness(() =>
				w(TabController, {
					activeIndex: 0,
					aria: {
						describedBy: 'foo',
						orientation: 'overridden'
					}
				})
			);

			h.expect(() => expected([expectedTabButtons(true), null], 'foo'));
		},

		'custom orientation'() {
			let properties = {
				activeIndex: 0,
				alignButtons: Align.bottom
			};
			const h = harness(() => w(TabController, properties, tabChildren()));

			let tabButtons = expectedTabButtons();
			let tabContent = expectedTabContent();
			h.expect(() => expected([tabContent, tabButtons], '', [css.alignBottom, css.root]));

			properties = {
				activeIndex: 0,
				alignButtons: Align.right
			};

			tabButtons = expectedTabButtons();
			tabContent = expectedTabContent();
			h.expect(() =>
				expected([tabContent, tabButtons], '', [css.alignRight, css.root], true)
			);

			properties = {
				activeIndex: 0,
				alignButtons: Align.left
			};
			h.expect(() => expected([tabButtons, tabContent], '', [css.alignLeft, css.root], true));
		},

		'Clicking tab should change activeIndex'() {
			const onRequestTabChange = sinon.stub();
			const h = harness(() =>
				w(
					TabController,
					{
						activeIndex: 2,
						onRequestTabChange
					},
					tabChildren(3)
				)
			);
			h.trigger('@0-tabbutton', 'onClick', 0);
			assert.isTrue(
				onRequestTabChange.calledOnce,
				'onRequestTabChange called when tab is clicked'
			);
			assert.isTrue(
				onRequestTabChange.calledWith(0, '0'),
				'onRequestTabChange called with correct index and key'
			);

			h.trigger('@1-tabbutton', 'onClick', 1);
			assert.isTrue(
				onRequestTabChange.calledOnce,
				'onRequestTabChange not called on disabled tabs'
			);

			h.trigger('@2-tabbutton', 'onClick', 2);
			assert.isTrue(
				onRequestTabChange.calledOnce,
				'onRequestTabChange not called on the active tab'
			);
		},

		'Closing a tab should change tabs'() {
			const onRequestTabClose = sinon.stub();
			const h = harness(() =>
				w(
					TabController,
					{
						activeIndex: 2,
						onRequestTabClose
					},
					tabChildren(3)
				)
			);

			h.trigger('@2-tabbutton', 'onCloseClick', 2);
			assert.isTrue(
				onRequestTabClose.calledOnce,
				"onRequestTabClose called when a tab's onCloseClick fires"
			);
			assert.isTrue(
				onRequestTabClose.calledWith(2, '2'),
				'onRequestTabClose called with correct index and key'
			);
		},

		'Basic keyboard navigation'() {
			const onRequestTabChange = sinon.stub();
			const h = harness(() =>
				w(
					TabController,
					{
						activeIndex: 2,
						onRequestTabChange
					},
					tabChildren(5)
				)
			);

			h.trigger('@2-tabbutton', 'onRightArrowPress', 2);
			assert.strictEqual(
				onRequestTabChange.getCall(0).args[0],
				3,
				'Right arrow moves to next tab'
			);

			h.trigger('@2-tabbutton', 'onDownArrowPress', 2);
			assert.isTrue(
				onRequestTabChange.calledOnce,
				'Down arrow does nothing on horizontal tabs'
			);

			h.trigger('@2-tabbutton', 'onLeftArrowPress', 2);
			assert.strictEqual(
				onRequestTabChange.getCall(1).args[0],
				0,
				'Left arrow moves to previous tab, skipping disabled tab'
			);

			h.trigger('@2-tabbutton', 'onUpArrowPress', 2);
			assert.isTrue(
				onRequestTabChange.calledTwice,
				'Up arrow does nothing on horizontal tabs'
			);

			h.trigger('@2-tabbutton', 'onHomePress', 2);
			assert.strictEqual(onRequestTabChange.getCall(2).args[0], 0, 'Home moves to first tab');

			h.trigger('@2-tabbutton', 'onEndPress', 2);
			assert.strictEqual(onRequestTabChange.getCall(3).args[0], 4, 'End moves to last tab');
		},

		'Arrow keys wrap to first and last tab'() {
			const onRequestTabChange = sinon.stub();
			let properties: any = {
				activeIndex: 0,
				onRequestTabChange
			};
			const h = harness(() => w(TabController, properties, tabChildren(3)));

			h.trigger('@0-tabbutton', 'onLeftArrowPress', 2);
			assert.isTrue(
				onRequestTabChange.calledWith(2),
				'Left arrow wraps from first to last tab'
			);

			properties = {
				activeIndex: 2,
				onRequestTabChange
			};
			h.trigger('@2-tabbutton', 'onRightArrowPress', 2);
			assert.isTrue(
				onRequestTabChange.calledWith(0),
				'Right arrow wraps from last to first tab'
			);
		},

		'Arrow keys on vertical tabs'() {
			const onRequestTabChange = sinon.stub();
			let properties: any = {
				activeIndex: 0,
				alignButtons: Align.right,
				onRequestTabChange
			};
			const h = harness(() => w(TabController, properties, tabChildren(5)));

			h.trigger('@0-tabbutton', 'onDownArrowPress', 0);
			assert.strictEqual(
				onRequestTabChange.getCall(0).args[0],
				2,
				'Down arrow moves to next tab, skipping disabled tab'
			);

			h.trigger('@0-tabbutton', 'onRightArrowPress', 0);
			assert.strictEqual(
				onRequestTabChange.getCall(1).args[0],
				2,
				'Right arrow works on vertical tabs'
			);

			h.trigger('@0-tabbutton', 'onUpArrowPress', 0);
			assert.strictEqual(
				onRequestTabChange.getCall(2).args[0],
				4,
				'Up arrow moves to previous tab'
			);

			h.trigger('@0-tabbutton', 'onLeftArrowPress', 0);
			assert.strictEqual(
				onRequestTabChange.getCall(3).args[0],
				4,
				'Left arrow works on vertical tabs'
			);

			properties = {
				activeIndex: 0,
				alignButtons: Align.left,
				onRequestTabChange
			};
			h.trigger('@0-tabbutton', 'onDownArrowPress', 0);
			assert.strictEqual(
				onRequestTabChange.getCall(4).args[0],
				2,
				'Down arrow works on left-aligned tabs'
			);
		},

		'Should default to last tab if invalid activeIndex passed'() {
			const onRequestTabChange = sinon.stub();
			harness(() =>
				w(
					TabController,
					{
						activeIndex: 5,
						onRequestTabChange
					},
					tabChildren(5)
				)
			);
			assert.isTrue(onRequestTabChange.calledWith(4));
		},

		'Should skip tab if activeIndex is disabled'() {
			const onRequestTabChange = sinon.stub();
			harness(() =>
				w(
					TabController,
					{
						activeIndex: 1,
						onRequestTabChange
					},
					tabChildren(5)
				)
			);
			assert.isTrue(onRequestTabChange.calledWith(2));
		},

		'Calls focus when arrowing through tabs'() {
			const h = harness(
				() =>
					w(
						TabController,
						{
							activeIndex: 0
						},
						tabChildren()
					),
				[
					{
						selector: '@0-tabbutton',
						property: 'focus',
						comparator: isFocusedComparator
					}
				]
			);
			h.trigger('@0-tabbutton', 'onRightArrowPress');
			let tabButtons = expectedTabButtons();
			let tabContent = expectedTabContent();

			h.expect(() => expected([tabButtons, tabContent]));
		},

		'Calls focus when closing a tab'() {
			const h = harness(
				() =>
					w(
						TabController,
						{
							activeIndex: 0
						},
						tabChildren()
					),
				[
					{
						selector: '@0-tabbutton',
						property: 'focus',
						comparator: isFocusedComparator
					}
				]
			);
			h.trigger('@1-tabbutton', 'onCloseClick', 1);
			let tabButtons = expectedTabButtons();
			let tabContent = expectedTabContent();

			h.expect(() => expected([tabButtons, tabContent]));
		}
	}
});
