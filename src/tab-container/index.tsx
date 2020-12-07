import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import { create, tsx } from '@dojo/framework/core/vdom';
import Icon from '../icon';

import bundle from './nls/TabContainer';
import { formatAriaProperties, Keys } from '../common/util';
import * as css from '../theme/default/tab-container.m.css';
import { AriaAttributes } from '@dojo/framework/core/interfaces';

export interface TabItem {
	closeable?: boolean;
	disabled?: boolean;
	name: string;
}

export interface TabContainerProperties {
	/** Orientation of the tab buttons, defaults to top */
	alignButtons?: 'bottom' | 'top' | 'left' | 'right';
	/** callback when a tabs close icon is clicked */
	onClose?(index: number): void;
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
}

const factory = create({
	focus,
	i18n,
	icache: createICacheMiddleware<TabContainerICache>(),
	theme
}).properties<TabContainerProperties>();

export const TabContainer = factory(function TabContainer({
	children,
	id,
	middleware: { focus, i18n, icache, theme },
	properties
}) {
	const {
		alignButtons = 'top',
		aria = {},
		initialActiveIndex = 0,
		tabs,
		onActiveIndex,
		onClose,
		theme: themeProp,
		classes,
		variant
	} = properties();
	let { activeIndex } = properties();

	const themeCss = theme.classes(css);
	const { messages } = i18n.localize(bundle);

	if (activeIndex === undefined) {
		activeIndex = icache.getOrSet('activeIndex', initialActiveIndex);
	}

	function closeTab(index: number) {
		onClose && onClose(index);
		setActiveIndex(0);
	}

	function setActiveIndex(index: number) {
		focus.focus();
		onActiveIndex && onActiveIndex(index);
		icache.set('activeIndex', index);
	}

	function onKeyDown(event: KeyboardEvent, { closeable, disabled }: TabItem, index: number) {
		event.stopPropagation();
		const total = tabs.length;

		switch (event.which) {
			case Keys.Escape:
				if (closeable && !disabled) {
					closeTab(index);
				}
				break;
			case Keys.Left:
			case Keys.Up:
				event.preventDefault();
				setActiveIndex((index - 1 + total) % total);
				break;
			case Keys.Right:
			case Keys.Down:
				event.preventDefault();
				setActiveIndex((index + 1) % total);
				break;
			case Keys.Home:
				event.preventDefault();
				setActiveIndex(0);
				break;
			case Keys.End:
				event.preventDefault();
				setActiveIndex(tabs.length - 1);
				break;
		}
	}

	const renderTab = (tab: TabItem, index: number) => {
		const { closeable, disabled, name } = tab;

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
						setActiveIndex(index);
					}
				}}
				onkeydown={(event) => onKeyDown(event, tab, index)}
				role="tab"
				tabIndex={active ? 0 : -1}
			>
				<span key="tabButtonContent" classes={themeCss.tabButtonContent}>
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
									closeTab(index);
								}
							}}
						>
							<Icon
								type="closeIcon"
								altText={messages.close}
								size="small"
								theme={themeProp}
								classes={classes}
								variant={variant}
							/>
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
			{children().map((child, index) => {
				const disabled = tabs[index].disabled;
				const active = activeIndex === index && !disabled;
				return (
					<div classes={active ? themeCss.tab : undefined} hidden={!active}>
						{child}
					</div>
				);
			})}
		</div>
	];

	let alignClass;
	let orientation: AriaAttributes['aria-orientation'] = 'horizontal';

	switch (alignButtons) {
		case 'right':
			alignClass = themeCss.alignRight;
			orientation = 'vertical';
			content.reverse();
			break;
		case 'bottom':
			alignClass = themeCss.alignBottom;
			content.reverse();
			break;
		case 'left':
			alignClass = themeCss.alignLeft;
			orientation = 'vertical';
			break;
	}

	return (
		<div
			{...formatAriaProperties(aria)}
			key="root"
			aria-orientation={orientation}
			classes={[theme.variant(), alignClass || null, themeCss.root]}
			role="tablist"
		>
			{...content}
		</div>
	);
});

export default TabContainer;
