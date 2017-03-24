import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { includes } from '@dojo/shim/array';
import { v, w } from '@dojo/widget-core/d';
import Tab from './Tab';
import TabButton from './TabButton';
import uuid from '@dojo/core/uuid';

import * as css from './styles/tabPane.css';

/**
 * @type TabConfig
 *
 * Object used to configure a tab
 *
 * @property closeable  Whether this tab should be closeable
 * @property content    The content to show in the tab
 * @property disabled   Whether this tab should be disabled
 * @property label      The content to show in the tab button
 */
export type TabConfig = {
	closeable?: boolean;
	content?: DNode;
	disabled?: boolean;
	label?: DNode;
};

/**
 * Enum for tab button alignment
 */
export const enum Align {
	bottom,
	left,
	right,
	top
};

/**
 * @type TabPaneProperties
 *
 * Properties that can be set on a TabPane component
 *
 * @property activeIndex           Position of the currently active tab
 * @property alignButtons          Position of the tab buttons
 * @property tabs                  List of tab configuration objects
 * @property onRequestTabChange    Called when a new tab button is clicked
 * @property onRequestTabClose     Called when a tab close button is clicked
 */
export interface TabPaneProperties extends ThemeableProperties {
	activeIndex: number;
	alignButtons?: Align;
	tabs: TabConfig[];
	onRequestTabChange?(index: number): void;
	onRequestTabClose?(tabs: TabConfig[]): void;
};

export const TabPaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TabPane extends TabPaneBase<TabPaneProperties> {
	private _id: string;

	private _getNextIndex(backwards?: boolean) {
		const {
			activeIndex,
			tabs
		} = this.properties;

		if (tabs.every(result => Boolean(result.disabled))) {
			return;
		}

		function nextIndex(index: number) {
			if (backwards) {
				return (tabs.length + (index - 1)) % tabs.length;
			}
			return (index + 1) % tabs.length;
		}

		let i = !tabs[activeIndex] ? 0 : nextIndex(activeIndex);

		while (tabs[i].disabled) {
			i = nextIndex(i);
		}

		return i;
	}

	private _getFirstTab() {
		this.properties.tabs.length > 0 && this.onTabClick(0);
	}

	private _getLastTab() {
		const { tabs } = this.properties;
		tabs.length > 0 && this.onTabClick(tabs.length - 1);
	}

	private _getNextTab() {
		const index = this._getNextIndex();
		typeof index === 'number' && this.onTabClick(index);
	}

	private _getPreviousTab() {
		const index = this._getNextIndex(true);
		typeof index === 'number' && this.onTabClick(index);
	}

	private _renderTabButtons() {
		const {
			activeIndex,
			tabs
		} = this.properties;

		return tabs.map((tab, i) => {
			return w(TabButton, {
				active: i === activeIndex,
				closeable: tab.closeable,
				controls: `${ this._id }-tab-${i}`,
				disabled: tab.disabled,
				id: `${ this._id }-tabbutton-${i}`,
				index: i,
				key: String(i),
				onClick: this.onTabClick,
				onCloseClick: this.onCloseClick,
				onEndPress: this._getLastTab,
				onHomePress: this._getFirstTab,
				onLeftArrowPress: this._getPreviousTab,
				onRightArrowPress: this._getNextTab
			}, [
				tab.label || null
			]);
		});
	}

	private _renderTabs() {
		const {
			activeIndex,
			tabs
		} = this.properties;

		return tabs
			.filter((tab, i) => {
				return i === activeIndex;
			})
			.map((tab, i) => w(Tab, {
				id: `${ this._id }-tab-${i}`,
				labelledBy: `${ this._id }-tabbutton-${i}`
			}, [
				tab.content || null
			]));
	}

	protected onCloseClick(index: number) {
		const {
			tabs,
			onRequestTabClose
		} = this.properties;

		const newTabs = [...tabs];
		newTabs.splice(index, 1);

		onRequestTabClose && onRequestTabClose(newTabs);
	}

	@onPropertiesChanged
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, TabPaneProperties>) {
		const keys = evt.changedPropertyKeys;
		const {
			activeIndex,
			tabs
		} = this.properties;

		// If the current tab is disabled or invalid, find the next available
		if ((includes(keys, 'tabs') || includes(keys, 'activeIndex'))) {
			const tab = tabs[activeIndex];
			if (!tab || tab.disabled) {
				const index = this._getNextIndex();
				typeof index === 'number' && this.onTabClick(index);
			}
		}
	}

	protected onTabClick(index: number) {
		const { onRequestTabChange } = this.properties;
		onRequestTabChange && onRequestTabChange(index);
	}

	render(): DNode {
		const { alignButtons } = this.properties;

		this._id = uuid();

		const children = [
			v('div', {
				key: 'buttons',
				classes: this.classes(css.tabButtons)
			}, this._renderTabButtons()),
			v('div', {
				key: 'tabs',
				classes: this.classes(css.tabs)
			}, this._renderTabs())
		];

		let alignClass;
		let orientation = 'horizontal';

		switch (alignButtons) {
			case Align.right:
				alignClass = css.alignRight;
				orientation = 'vertical';
				children.reverse();
				break;
			case Align.bottom:
				alignClass = css.alignBottom;
				children.reverse();
				break;
			case Align.left:
				alignClass = css.alignLeft;
				orientation = 'vertical';
				break;
		}

		return v('div', {
			'aria-orientation': orientation,
			classes: this.classes(
				css.root,
				alignClass ? alignClass : null
			),
			role: 'tablist'
		}, children);
	}
}
