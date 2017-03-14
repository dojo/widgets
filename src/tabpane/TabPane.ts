import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { includes } from '@dojo/shim/array';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/tabPane.css';
import Tab from './Tab';
import TabButton from './TabButton';

/**
 * @type TabConfig
 * 
 * Object used to configure a tab
 * 
 * @property label		The content to show in the tab button
 * @property content	The content to show in the tab
 * @property closeable	Whether this tab should be closeable
 * @property disabled	Whether this tab should be disabled
 */
export type TabConfig = {
	label?: DNode;
	content?: DNode;
	closeable?: boolean;
	disabled?: boolean;
};

/**
 * Enum for tab button alignment
 */
export const enum Align {
	top,
	right,
	bottom,
	left
};

/**
 * @type TabPaneProperties
 *
 * Properties that can be set on a TabPane component
 * 
 * @property activeIndex 			Position of the currently active tab
 * @property alignButtons			Position of the tab buttons
 * @property loadingIndex 			Position of the currently loading tab, useful for tabs with async content
 * @property tabs 					List of tab configuration objects
 * @property onRequestTabChange		Called when a new tab button is clicked
 * @property onRequestTabClose		Called when a tab close button is clicked
 */
export interface TabPaneProperties extends ThemeableProperties {
	activeIndex?: number;
	alignButtons?: Align;
	loadingIndex?: number;
	tabs?: TabConfig[];
	onRequestTabChange?(index: number): void;
	onRequestTabClose?(tabs: TabConfig[]): void;
};

export const TabPaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TabPane extends TabPaneBase<TabPaneProperties> {
	private _loading: boolean;

	private _renderTabButtons() {
		const {
			activeIndex = 0,
			loadingIndex,
			tabs = []
		} = this.properties;

		return tabs.map((tab, i) => w(TabButton, {
			key: String(i),
			active: i === (this._loading ? loadingIndex : activeIndex),
			closeable: tab.closeable,
			disabled: tab.disabled,
			index: i,
			loading: i === loadingIndex,
			onClick: this.onTabClick,
			onCloseClick: this.onCloseClick
		}, [ tab.label || null ]));
	}

	private _renderTabs() {
		const {
			activeIndex = 0,
			loadingIndex,
			tabs = []
		} = this.properties;

		return tabs.filter((tab, i) => {
			return i === (this._loading ? loadingIndex : activeIndex);
		}).map((tab, i) => w(Tab, {
			active: true,
			loading: this._loading
		}, [ this._loading ? 'Loading...' : (tab.content || null) ]));
	}

	protected onTabClick(index: number) {
		const { onRequestTabChange } = this.properties;
		onRequestTabChange && onRequestTabChange(index);
	}

	protected onCloseClick(index: number) {
		let {
			tabs = [],
			onRequestTabClose
		} = this.properties;

		const newTabs = [...tabs];
		newTabs.splice(index, 1);

		onRequestTabClose && onRequestTabClose(newTabs);
	}

	protected updateActiveIndex() {
		let {
			activeIndex = 0,
			tabs = [],
			onRequestTabChange
		} = this.properties;

		if (tabs[activeIndex] && !tabs[activeIndex].disabled) {
			return;
		}

		for (let i = 0; i < tabs.length; i++) {
			if (!tabs[i].disabled) {
				onRequestTabChange && onRequestTabChange(i);
				break;
			}
		}
	}

	@onPropertiesChanged
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, TabPaneProperties>) {
		if (includes(evt.changedPropertyKeys, 'tabs') || includes(evt.changedPropertyKeys, 'activeIndex')) {
			this.updateActiveIndex();
		}
		if (includes(evt.changedPropertyKeys, 'loadingIndex')) {
			const index = evt.properties.loadingIndex;
			this._loading = typeof index === 'number';
		}
	}

	render(): DNode {
		const { alignButtons } = this.properties;

		let alignClass;
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

		switch (alignButtons) {
			case Align.right:
				alignClass = css.alignRight;
				children.reverse();
				break;
			case Align.bottom:
				alignClass = css.alignBottom;
				children.reverse();
				break;
			case Align.left:
				alignClass = css.alignLeft;
				break;
		}

		return v('div', {
			classes: this.classes(
				css.root,
				alignClass ? alignClass : null
			)
		}, children);
	}
}
