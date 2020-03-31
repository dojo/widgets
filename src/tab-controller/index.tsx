import { DNode, RenderResult } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import Set from '@dojo/framework/shim/Set';
import WeakMap from '@dojo/framework/shim/WeakMap';

import commonBundle from '../common/nls/common';
import { formatAriaProperties, Keys } from '../common/util';
import * as css from '../theme/default/tab-controller.m.css';

/**
 * Enum for tab button alignment
 */
export enum Align {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

export interface TabItem {
	closeable?: boolean;
	disabled?: boolean;
	id: string;
	label: DNode;
}

export interface TabControllerProperties {
	/** Orientation of the tab buttons */
	alignButtons?: Align;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Index of the initial active tab. Defaults to 0. */
	initialIndex?: number;
	/** Tabs config used to display tab buttons */
	tabs: TabItem[];
}

export interface TabControllerChildren {
	(
		tabs: TabItem[],
		active: (id: string) => boolean,
		closed: (id: string) => boolean
	): RenderResult;
}

interface TabControllerICache {
	activeId: string | undefined;
	closedIds: Set<string>;
}

const factory = create({
	focus,
	i18n,
	icache: createICacheMiddleware<TabControllerICache>(),
	theme
})
	.properties<TabControllerProperties>()
	.children<TabControllerChildren>();

const tabIndicesById = new WeakMap<TabItem[], { [key: string]: number }>();
const findTabIndex = (tabs: TabItem[], id: string | undefined) => {
	if (id == null) {
		return -1;
	}
	let indices = tabIndicesById.get(tabs);
	if (!indices) {
		indices = tabs.reduce((result: { [key: string]: number }, tab, index) => {
			result[tab.id] = index;
			return result;
		}, {});
		tabIndicesById.set(tabs, indices);
	}
	return indices[id];
};

export const TabController = factory(function TabController({
	children,
	id,
	middleware: { focus, i18n, icache, theme },
	properties
}) {
	/**
	 * Determines if the tab at `currentIndex` is enabled. If disabled,
	 * returns the next valid index, or null if no enabled tabs exist.
	 */
	const validateIndex = (currentIndex: number, backwards?: boolean) => {
		const { tabs } = properties();
		const closedIds = icache.get('closedIds') as Set<string>;
		const selectableTabs = tabs.filter((tab) => !tab.disabled && !closedIds.has(tab.id));

		if (!selectableTabs.length) {
			return null;
		}

		function nextIndex(index: number) {
			if (backwards) {
				return (tabs.length + (index - 1)) % tabs.length;
			}
			return (index + 1) % tabs.length;
		}

		let i = !tabs[currentIndex] ? tabs.length - 1 : currentIndex;
		let tab = tabs[i];

		while (tab.disabled || closedIds.has(tab.id)) {
			i = nextIndex(i);
			tab = tabs[i];
		}

		return i;
	};

	const selectIndex = (index: number, backwards?: boolean) => {
		const { tabs } = properties();
		const activeId = icache.get('activeId');
		const activeIndex = findTabIndex(tabs, activeId);
		const validIndex = validateIndex(index, backwards);
		focus.focus();

		if (validIndex !== null && validIndex !== activeIndex) {
			icache.set('activeId', tabs[validIndex].id);
		}
	};

	const selectNextIndex = () => {
		const { tabs } = properties();
		const activeIndex = findTabIndex(tabs, icache.get('activeId'));
		selectIndex(activeIndex === tabs.length - 1 ? 0 : activeIndex + 1);
	};

	const selectPreviousIndex = () => {
		const { tabs } = properties();
		const activeIndex = findTabIndex(tabs, icache.get('activeId'));
		selectIndex(activeIndex === 0 ? tabs.length - 1 : activeIndex - 1, true);
	};

	const closeId = (id: string) => {
		const closedIds = icache.get('closedIds') as Set<string>;
		const { tabs } = properties();
		const openedTabs = tabs.filter((tab) => !closedIds.has(tab.id));

		focus.focus();
		icache.set('closedIds', new Set([...closedIds, id]));

		const activeIndex = findTabIndex(tabs, icache.get('activeId'));
		const closedIndex = findTabIndex(tabs, id);
		if (closedIndex === activeIndex) {
			closedIndex === openedTabs.length - 1 ? selectPreviousIndex() : selectNextIndex();
		}
	};

	const onDownArrowPress = () => {
		const { alignButtons } = properties();

		if (alignButtons === Align.left || alignButtons === Align.right) {
			selectNextIndex();
		}
	};

	const selectLastIndex = () => {
		const { tabs } = properties();
		selectIndex(tabs.length - 1);
	};

	const selectFirstIndex = () => {
		selectIndex(0, true);
	};

	const onLeftArrowPress = () => {
		selectPreviousIndex();
	};

	const onRightArrowPress = () => {
		selectNextIndex();
	};

	const onUpArrowPress = () => {
		const { alignButtons } = properties();

		if (alignButtons === Align.left || alignButtons === Align.right) {
			selectPreviousIndex();
		}
	};

	const onKeyDown = (event: KeyboardEvent, { closeable, disabled, id }: TabItem) => {
		event.stopPropagation();

		if (disabled) {
			return;
		}

		switch (event.which) {
			case Keys.Escape:
				closeable && closeId(id);
				break;
			case Keys.Left:
				onLeftArrowPress();
				break;
			case Keys.Right:
				onRightArrowPress();
				break;
			case Keys.Up:
				onUpArrowPress();
				break;
			case Keys.Down:
				onDownArrowPress();
				break;
			case Keys.Home:
				selectFirstIndex();
				break;
			case Keys.End:
				selectLastIndex();
				break;
		}
	};

	const { alignButtons, aria = {}, initialIndex, tabs } = properties();
	const themeCss = theme.classes(css);
	const { messages } = i18n.localize(commonBundle);

	const closedIds = icache.getOrSet('closedIds', new Set<string>());
	const validIndex = validateIndex(initialIndex || 0);
	const activeId = icache.getOrSet(
		'activeId',
		validIndex != null ? tabs[validIndex].id : undefined
	);
	const [renderer] = children();
	const tabContents = renderer(tabs, (id) => id === activeId, (id) => closedIds.has(id));

	const renderTab = (tab: TabItem, index: number) => {
		const { closeable, disabled, label } = tab;
		const active = tab.id === activeId;

		if (closedIds.has(tab.id)) {
			return null;
		}

		return (
			<div
				aria-controls={`${id}-tab-${index}`}
				aria-disabled={disabled ? 'true' : 'false'}
				aria-selected={active ? 'true' : 'false'}
				classes={[
					themeCss.tabButton,
					active ? themeCss.activeTabButton : null,
					closeable ? themeCss.closeable : null,
					disabled ? themeCss.disabledTabButton : null
				]}
				focus={active ? focus.shouldFocus : () => false}
				id={`${id}-tabbutton-${index}`}
				key={`${index}-tabbutton`}
				onclick={() => {
					if (!disabled) {
						icache.set('activeId', tab.id);
					}
				}}
				onkeydown={(event) => onKeyDown(event, tab)}
				role="tab"
				tabIndex={active ? 0 : -1}
			>
				<span classes={themeCss.tabButtonContent}>
					{label}
					{closeable ? (
						<button
							disabled={disabled}
							tabIndex={active ? 0 : -1}
							classes={themeCss.close}
							key={`${index}-tabbutton-close`}
							type="button"
							onclick={(event) => {
								event.stopPropagation();
								if (!disabled) {
									closeId(tab.id);
								}
							}}
						>
							{messages.close}
						</button>
					) : null}
					<span classes={[themeCss.indicator, active && themeCss.indicatorActive]}>
						<span classes={themeCss.indicatorContent} />
					</span>
				</span>
			</div>
		);
	};

	const content = [
		<div key="buttons" classes={themeCss.tabButtons}>
			{tabs.map(renderTab)}
		</div>,
		tabContents ? (
			<div key="tabs" classes={themeCss.tabs}>
				{tabContents}
			</div>
		) : null
	];

	let alignClass;
	let orientation = 'horizontal';

	switch (alignButtons) {
		case Align.right:
			alignClass = themeCss.alignRight;
			orientation = 'vertical';
			content.reverse();
			break;
		case Align.bottom:
			alignClass = themeCss.alignBottom;
			content.reverse();
			break;
		case Align.left:
			alignClass = themeCss.alignLeft;
			orientation = 'vertical';
			break;
	}

	return (
		<div
			{...formatAriaProperties(aria)}
			aria-orientation={orientation}
			classes={[theme.variant(), alignClass || null, themeCss.root]}
			role="tablist"
		>
			{...content}
		</div>
	);
});

export default TabController;
