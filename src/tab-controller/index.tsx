import { WNode } from '@dojo/framework/core/interfaces';
import focus from '@dojo/framework/core/middleware/focus';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import { create, isWNode, tsx } from '@dojo/framework/core/vdom';
import { assign } from '@dojo/framework/shim/object';

import { formatAriaProperties } from '../common/util';
import Tab, { TabProperties } from '../tab/index';
import * as css from '../theme/default/tab-controller.m.css';
import TabButton from './TabButton';

/**
 * Enum for tab button alignment
 */
export enum Align {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

export interface TabControllerProperties {
	/** Position of the currently active tab */
	activeIndex: number;
	/** Orientation of the tab buttons */
	alignButtons?: Align;
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Called when a new tab button is clicked */
	onRequestTabChange?(index: number, key: string): void;
	/** Called when a tab close button is clicked */
	onRequestTabClose?(index: number, key: string): void;
}

const factory = create({ focus, i18n, theme }).properties<TabControllerProperties>();

export const TabController = factory(function TabController({
	children,
	id,
	middleware: { focus, theme },
	properties
}) {
	const themeCss = theme.classes(css);
	const tabChildren = children().filter((child) => isWNode<Tab>(child)) as WNode<Tab>[];

	/**
	 * Determines if the tab at `currentIndex` is enabled. If disabled,
	 * returns the next valid index, or null if no enabled tabs exist.
	 */
	const validateIndex = (currentIndex: number, backwards?: boolean) => {
		if (tabChildren.every((result) => Boolean(result.properties.disabled))) {
			return null;
		}

		function nextIndex(index: number) {
			if (backwards) {
				return (tabChildren.length + (index - 1)) % tabChildren.length;
			}
			return (index + 1) % tabChildren.length;
		}

		let i = !tabChildren[currentIndex] ? tabChildren.length - 1 : currentIndex;

		while (tabChildren[i].properties.disabled) {
			i = nextIndex(i);
		}

		return i;
	};

	const selectIndex = (index: number, backwards?: boolean) => {
		const { activeIndex, onRequestTabChange } = properties();

		const validIndex = validateIndex(index, backwards);
		focus.focus();

		if (validIndex !== null && validIndex !== activeIndex) {
			const key = tabChildren[validIndex].properties.key;
			onRequestTabChange && onRequestTabChange(validIndex, key);
		}
	};

	const closeIndex = (index: number) => {
		const { onRequestTabClose } = properties();
		const key = tabChildren[index].properties.key;
		focus.focus();

		onRequestTabClose && onRequestTabClose(index, key);
	};

	const selectNextIndex = () => {
		const { activeIndex } = properties();
		selectIndex(activeIndex === tabChildren.length - 1 ? 0 : activeIndex + 1);
	};

	const selectPreviousIndex = () => {
		const { activeIndex } = properties();

		selectIndex(activeIndex === 0 ? tabChildren.length - 1 : activeIndex - 1, true);
	};

	const onDownArrowPress = () => {
		const { alignButtons } = properties();

		if (alignButtons === Align.left || alignButtons === Align.right) {
			selectNextIndex();
		}
	};

	const selectLastIndex = () => {
		selectIndex(tabChildren.length - 1);
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

	const { activeIndex, alignButtons, aria = {} } = properties();
	const validIndex = validateIndex(activeIndex);

	if (validIndex !== null && validIndex !== activeIndex) {
		selectIndex(validIndex);
		return null;
	}

	const tabs = tabChildren.map((tab, i) => {
		assign(tab.properties, {
			widgetId: `${id}-tab-${i}`,
			labelledBy: `${id}-tabbutton-${i}`,
			show: i === activeIndex
		});
		return tab;
	});

	const tabButtons = tabChildren.map((tab, i) => {
		const { classes, closeable, disabled, key, label, theme } = tab.properties as TabProperties;

		return (
			<TabButton
				active={i === activeIndex}
				classes={classes}
				theme={theme}
				closeable={closeable}
				controls={`${id}-tab-${i}`}
				disabled={disabled}
				focus={i === activeIndex ? focus.shouldFocus : () => false}
				id={`${id}-tabbutton-${i}`}
				index={i}
				key={`${key}-tabbutton`}
				onClick={selectIndex}
				onCloseClick={closeIndex}
				onDownArrowPress={onDownArrowPress}
				onEndPress={selectLastIndex}
				onHomePress={selectFirstIndex}
				onLeftArrowPress={onLeftArrowPress}
				onRightArrowPress={onRightArrowPress}
				onUpArrowPress={onUpArrowPress}
			>
				{label}
			</TabButton>
		);
	});

	const content = [
		<div key="buttons" classes={themeCss.tabButtons}>
			{...tabButtons}
		</div>,
		tabs.length ? (
			<div key="tabs" classes={themeCss.tabs}>
				{...tabs}
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
			classes={[alignClass || null, themeCss.root]}
			role="tablist"
		>
			{...content}
		</div>
	);
});

export default TabController;
