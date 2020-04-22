import { RenderResult } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '@dojo/framework/core/middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import Set from '@dojo/framework/shim/Set';

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
	name: string;
}

export interface TabContainerProperties {
	/** Orientation of the tab buttons */
	alignButtons?: Align;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** initial active tab ID. Defaults to the first tab's ID. */
	initialActiveIndex?: number;
	/** controlled active tab ID */
	activeIndex?: number;
	/** Callback fired when a tab is changed if `activeTab` is passed */
	onActiveIndex?(index: number): void;
	/** Tabs config used to display tab buttons */
	tabs: TabItem[];
}

interface TabContainerICache {
	activeIndex: number | undefined;
	closedIndexes: Set<number>;
}

const factory = create({
	focus,
	i18n,
	icache: createICacheMiddleware<TabContainerICache>(),
	theme
})
	.properties<TabContainerProperties>()
	.children();

// const tabIndicesById = new WeakMap<TabItem[], { [key: string]: number }>();
// const findTabIndex = (tabs: TabItem[], id: string | undefined) => {
// 	if (id == null) {
// 		return -1;
// 	}
// 	let indices = tabIndicesById.get(tabs);
// 	if (!indices) {
// 		indices = tabs.reduce((result: { [key: string]: number }, tab, index) => {
// 			result[tab.id] = index;
// 			return result;
// 		}, {});
// 		tabIndicesById.set(tabs, indices);
// 	}
// 	return indices[id];
// };

export const TabContainer = factory(function TabController({
	children,
	id,
	middleware: { focus, i18n, icache, theme },
	properties
}) {
	function setIndex(index: number) {
		onActiveIndex && onActiveIndex(index);
		icache.set('activeIndex', index);
	}

	function closeIndex(index: number) {
		const closedIndexes = icache.getOrSet('closedIndexes', new Set<number>());
		icache.set('closedIndexes', closedIndexes.add(index));
	}

	function onKeyDown(event: KeyboardEvent, { closeable, disabled }: TabItem, index: number) {
		event.stopPropagation();

		if (disabled) {
			return;
		}

		switch (event.which) {
			case Keys.Escape:
				if (closeable) {
					closeIndex(index);
				}
				break;
			case Keys.Left:
			case Keys.Down:
				setIndex(index - 1);
				break;
			case Keys.Right:
			case Keys.Up:
				setIndex(index + 1);
				break;
			case Keys.Home:
				setIndex(0);
				break;
			case Keys.End:
				setIndex(tabs.length - 1);
				break;
		}
	}

	const { alignButtons, aria = {}, initialActiveIndex, tabs, onActiveIndex } = properties();
	let { activeIndex } = properties();

	const themeCss = theme.classes(css);
	const { messages } = i18n.localize(commonBundle);

	const closedIndexes = icache.getOrSet('closedIndexes', new Set<number>());

	if (activeIndex === undefined) {
		activeIndex = icache.getOrSet('activeIndex', initialActiveIndex);
	}

	const renderTab = (tab: TabItem, index: number) => {
		const { closeable, disabled, name } = tab;

		if (closedIndexes.has(index)) {
			return null;
		}

		const active = index === activeIndex;

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
						setIndex(index);
					}
				}}
				onkeydown={(event) => onKeyDown(event, tab, index)}
				role="tab"
				tabIndex={active ? 0 : -1}
			>
				<span classes={themeCss.tabButtonContent}>
					{name}
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
									closeIndex(index);
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
		<div key="tabs" classes={themeCss.tabs}>
			{children()}
		</div>
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

export default TabContainer;
