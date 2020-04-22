const { registerSuite } = intern.getInterface('object');
const { assert } = intern.getPlugin('chai');

import * as sinon from 'sinon';

import { tsx } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';

import commonBundle from '../../../common/nls/common';
import { Keys } from '../../../common/util';
import TabContainer, { Align, TabContainerChildren, TabItem } from '../../index';
import TabContent from '../../TabContent';
import * as css from '../../../theme/default/tab-controller.m.css';
import {
	createHarness,
	compareId,
	compareWidgetId,
	isFocusedComparator,
	isStringComparator,
	noop
} from '../../../common/tests/support/test-helpers';

const { messages } = commonBundle;

const compareLabelledBy = { selector: '*', property: 'labelledBy', comparator: isStringComparator };
const compareControls = { selector: '*', property: 'controls', comparator: isStringComparator };
const harness = createHarness([compareId, compareWidgetId, compareControls, compareLabelledBy]);

const createMockKeydownEvent = (which: number) => {
	return {
		stopPropagation: sinon.spy(),
		which
	} as any;
};

const tabChildren = (tabs: TabItem[]): TabContainerChildren => {
	return (_, active, closed) =>
		tabs.map((_tab, i) => {
			const key = `tab${i}`;
			return (
				<TabContent key={key} active={active(key)} closed={closed(key)}>
					{`tab content ${i + 1}`}
				</TabContent>
			);
		});
};

const expectedTabButtons = (tabs: TabItem[], activeIndex = 0, closedIndex = -1): DNode => {
	if (!tabs.length) {
		return <div key="buttons" classes={css.tabButtons} />;
	}

	const tabButtons: DNode[] = [];
	tabs.forEach((tab, i) => {
		if (closedIndex !== i) {
			const active = i === activeIndex;
			tabButtons.push(
				<div
					aria-controls={`test-tab-${i}`}
					aria-disabled={tab.disabled ? 'true' : 'false'}
					aria-selected={active ? 'true' : 'false'}
					classes={[
						css.tabButton,
						active ? css.activeTabButton : null,
						tab.closeable ? css.closeable : null,
						tab.disabled ? css.disabledTabButton : null
					]}
					focus={noop}
					id=""
					key={`${i}-tabbutton`}
					onclick={noop}
					onkeydown={noop}
					role="tab"
					tabIndex={active ? 0 : -1}
				>
					<span classes={css.tabButtonContent}>
						{tab.name}
						{tab.closeable ? (
							<button
								tabIndex={active ? 0 : -1}
								classes={css.close}
								type="button"
								onclick={noop}
							>
								{messages.close}
							</button>
						) : null}
						<span classes={[css.indicator, active && css.indicatorActive]}>
							<span classes={css.indicatorContent} />
						</span>
					</span>
				</div>
			);
		}
	});

	return (
		<div key="buttons" classes={css.tabButtons}>
			{tabButtons}
		</div>
	);
};

const expectedTabContent = (tabs: TabItem[], activeIndex = 0, closedIndex = -1): DNode => {
	return (
		<div key="tabs" classes={css.tabs}>
			{tabs.map((_tab, i) => (
				<TabContent key={`tab${i}`} active={i === activeIndex} closed={i === closedIndex}>
					{`tab content ${i + 1}`}
				</TabContent>
			))}
		</div>
	);
};

const expected = function(
	children: DNode[] = [],
	describedby = '',
	classes = [undefined, null, css.root],
	vertical = false
) {
	const overrides = describedby
		? {
				'aria-describedby': describedby
		  }
		: null;
	return (
		<div
			aria-orientation={vertical ? 'vertical' : 'horizontal'}
			classes={classes}
			role="tablist"
			{...overrides}
		>
			{children}
		</div>
	);
};

registerSuite('TabController', {
	tests: {
		'default properties'() {
			const tabs: TabItem[] = [];
			const h = harness(() => <TabContainer tabs={tabs}>{() => []}</TabContainer>);
			h.expect(() => expected([expectedTabButtons(tabs), expectedTabContent(tabs)]));
		},

		'aria properties'() {
			const tabs: TabItem[] = [];
			const h = harness(() => (
				<TabContainer aria={{ describedBy: 'foo', orientation: 'overridden' }} tabs={tabs}>
					{() => []}
				</TabContainer>
			));

			h.expect(() => expected([expectedTabButtons(tabs), expectedTabContent(tabs)], 'foo'));
		},

		'custom orientation'() {
			const tabs: TabItem[] = [];
			let h = harness(() => (
				<TabContainer alignButtons={Align.bottom} tabs={tabs}>
					{() => []}
				</TabContainer>
			));
			h.expect(() =>
				expected([expectedTabContent(tabs), expectedTabButtons(tabs)], '', [
					undefined,
					css.alignBottom,
					css.root
				])
			);

			h = harness(() => (
				<TabContainer alignButtons={Align.right} tabs={[]}>
					{() => []}
				</TabContainer>
			));
			h.expect(() =>
				expected(
					[expectedTabContent(tabs), expectedTabButtons(tabs)],
					'',
					[undefined, css.alignRight, css.root],
					true
				)
			);

			h = harness(() => (
				<TabContainer alignButtons={Align.left} tabs={[]}>
					{() => []}
				</TabContainer>
			));
			h.expect(() =>
				expected(
					[expectedTabButtons(tabs), expectedTabContent(tabs)],
					'',
					[undefined, css.alignLeft, css.root],
					true
				)
			);
		},

		'Clicking tab should change the active tab'() {
			const tabs = [
				{ id: 'tab0', label: 'Tab 1' },
				{ disabled: true, id: 'tab1', label: 'Tab 2' },
				{ id: 'tab2', label: 'Tab 3' }
			];
			let currentActiveTab = 'tab2';

			const h = harness(() => (
				<TabContainer
					initialActiveTab="tab2"
					onActiveTab={(tabId) => {
						currentActiveTab = tabId;
					}}
					tabs={tabs}
				>
					{tabChildren(tabs)}
				</TabContainer>
			));

			h.trigger('@0-tabbutton', 'onclick');
			h.expect(() => expected([expectedTabButtons(tabs), expectedTabContent(tabs)]));
			assert.equal(currentActiveTab, 'tab0');

			h.trigger('@1-tabbutton', 'onclick');
			// nothing happens on disabled tabs
			h.expect(() => expected([expectedTabButtons(tabs), expectedTabContent(tabs)]));
			assert.equal(currentActiveTab, 'tab0');

			h.trigger('@2-tabbutton', 'onclick');
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActiveTab, 'tab2');
		},

		'Closing a tab should change tabs'() {
			const tabs = [
				{ id: 'tab0', label: 'Tab 1' },
				{ id: 'tab1', label: 'Tab 2' },
				{ closeable: true, id: 'tab2', label: 'Tab 3' }
			];
			const h = harness(() => (
				<TabContainer initialActiveTab="tab2" tabs={tabs}>
					{tabChildren(tabs)}
				</TabContainer>
			));

			const stopPropagation = sinon.spy();
			h.trigger('@2-tabbutton-close', 'onclick', { stopPropagation });
			assert.isTrue(stopPropagation.called, 'event.stopPropagation called');
			h.expect(() =>
				expected([expectedTabButtons(tabs, 1, 2), expectedTabContent(tabs, 1, 2)])
			);
		},

		'Basic keyboard navigation'() {
			const tabs: TabItem[] = '01234'
				.split('')
				.map((n) => ({ id: `tab${n}`, label: `Tab ${n + 1}` }));
			const h = harness(() => (
				<TabContainer initialActiveTab="tab2" tabs={tabs}>
					{tabChildren(tabs)}
				</TabContainer>
			));

			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			h.expect(() => expected([expectedTabButtons(tabs, 3), expectedTabContent(tabs, 3)]));
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Down));
			h.expect(() => expected([expectedTabButtons(tabs, 3), expectedTabContent(tabs, 3)]));
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Left));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Up));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Home));
			h.expect(() => expected([expectedTabButtons(tabs), expectedTabContent(tabs)]));
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.End));
			h.expect(() => expected([expectedTabButtons(tabs, 4), expectedTabContent(tabs, 4)]));
		},

		'activeTab is specified'() {
			const tabs: TabItem[] = '01234'
				.split('')
				.map((n) => ({ id: `tab${n}`, label: `Tab ${n + 1}` }));
			let currentActive = 'tab2';
			const h = harness(() => (
				<TabContainer
					activeTab="tab2"
					tabs={tabs}
					onActiveTab={(tabId) => {
						currentActive = tabId;
					}}
				>
					{tabChildren(tabs)}
				</TabContainer>
			));

			// Navigation shouldn't have an effect if activeTab isn't changed
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActive, 'tab3');
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Down));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActive, 'tab3');
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Left));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActive, 'tab1');
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Up));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActive, 'tab1');
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Home));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActive, 'tab0');
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.End));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			assert.equal(currentActive, 'tab4');
		},

		'Arrow keys wrap to first and last tab'() {
			const tabs = [
				{ id: 'tab0', label: 'Tab 1' },
				{ id: 'tab1', label: 'Tab 2' },
				{ id: 'tab2', label: 'Tab 3' }
			];
			let properties: any = { initialActiveTab: 'tab0', tabs };
			const h = harness(() => (
				<TabContainer {...properties}>{tabChildren(tabs)}</TabContainer>
			));
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Left));
			h.expect(() => expected([expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)]));
			properties = { initialActiveTab: 'tab2', tabs };
			h.trigger('@2-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			h.expect(() => expected([expectedTabButtons(tabs), expectedTabContent(tabs)]));
		},

		'Arrow keys on vertical tabs'() {
			const tabs: TabItem[] = '01234'
				.split('')
				.map((n) => ({ disabled: n === '1', id: `tab${n}`, label: `Tab ${n + 1}` }));
			let properties: any = {
				alignButtons: Align.right,
				tabs
			};
			const h = harness(() => (
				<TabContainer {...properties}>{tabChildren(tabs)}</TabContainer>
			));

			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Down));
			h.expect(() =>
				expected(
					[expectedTabContent(tabs, 2), expectedTabButtons(tabs, 2)],
					undefined,
					[undefined, css.alignRight, css.root],
					true
				)
			);

			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			h.expect(() =>
				expected(
					[expectedTabContent(tabs, 3), expectedTabButtons(tabs, 3)],
					undefined,
					[undefined, css.alignRight, css.root],
					true
				)
			);

			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Up));
			h.expect(() =>
				expected(
					[expectedTabContent(tabs, 2), expectedTabButtons(tabs, 2)],
					undefined,
					[undefined, css.alignRight, css.root],
					true
				)
			);

			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Left));
			h.expect(() =>
				expected(
					[expectedTabContent(tabs), expectedTabButtons(tabs)],
					undefined,
					[undefined, css.alignRight, css.root],
					true
				)
			);

			properties = { alignButtons: Align.left, tabs };
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Down));
			h.expect(() =>
				expected(
					[expectedTabButtons(tabs, 2), expectedTabContent(tabs, 2)],
					undefined,
					[undefined, css.alignLeft, css.root],
					true
				)
			);
		},

		'Should default to last tab if invalid initialActiveTab passed'() {
			const tabs = [
				{ id: 'tab0', label: 'Tab 1' },
				{ id: 'tab1', label: 'Tab 2' },
				{ id: 'tab2', label: 'Tab 3' }
			];
			const h = harness(() => (
				<TabContainer initialActiveTab="tab3" tabs={tabs}>
					{tabChildren(tabs)}
				</TabContainer>
			));
			const tabButtons = expectedTabButtons(tabs, 2);
			const tabContent = expectedTabContent(tabs, 2);
			h.expect(() => expected([tabButtons, tabContent]));
		},

		'Should skip tab if initialActiveTab tab is disabled'() {
			const tabs = [
				{ id: 'tab0', label: 'Tab 1' },
				{ disabled: true, id: 'tab1', label: 'Tab 2' },
				{ id: 'tab2', label: 'Tab 3' }
			];
			const h = harness(() => (
				<TabContainer initialActiveTab="tab1" tabs={tabs}>
					{tabChildren(tabs)}
				</TabContainer>
			));
			const tabButtons = expectedTabButtons(tabs, 2);
			const tabContent = expectedTabContent(tabs, 2);
			h.expect(() => expected([tabButtons, tabContent]));
		},

		'Calls focus when arrowing through tabs'() {
			const tabs = [{ id: 'tab0', label: 'Tab 1' }, { id: 'tab1', label: 'Tab 2' }];
			const h = harness(() => <TabContainer tabs={tabs}>{tabChildren(tabs)}</TabContainer>, [
				{
					selector: '@1-tabbutton',
					property: 'focus',
					comparator: isFocusedComparator
				}
			]);
			h.trigger('@0-tabbutton', 'onkeydown', createMockKeydownEvent(Keys.Right));
			const tabButtons = expectedTabButtons(tabs, 1);
			const tabContent = expectedTabContent(tabs, 1);
			h.expect(() => expected([tabButtons, tabContent]));
		},

		'Calls focus when closing a tab'() {
			const tabs = [
				{ closeable: true, id: 'tab0', label: 'Tab 1' },
				{ id: 'tab1', label: 'Tab 2' }
			];
			const h = harness(() => <TabContainer tabs={tabs}>{tabChildren(tabs)}</TabContainer>, [
				{
					selector: '@0-tabbutton',
					property: 'focus',
					comparator: isFocusedComparator
				}
			]);
			const stopPropagation = sinon.spy();
			h.trigger('@0-tabbutton-close', 'onclick', { stopPropagation });
			assert.isTrue(stopPropagation.called, 'clicking close button calls stopPropagation');
			const tabButtons = expectedTabButtons(tabs, 1, 0);
			const tabContent = expectedTabContent(tabs, 1, 0);
			h.expect(() => expected([tabButtons, tabContent]));
		}
	}
});
