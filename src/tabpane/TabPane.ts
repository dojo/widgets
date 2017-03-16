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
 * @property loadingIndex          Position of the currently loading tab, useful for tabs with async content
 * @property tabs                  List of tab configuration objects
 * @property onRequestTabChange    Called when a new tab button is clicked
 * @property onRequestTabClose     Called when a tab close button is clicked
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
	private _id: string;
	private _loading: boolean;

	private _firstTab() {
		this.onTabClick(0);
	}

	private _lastTab() {
		const { tabs = [] } = this.properties;

		this.onTabClick(tabs.length - 1);
	}

	private _nextTab() {
		const {
			activeIndex = 0,
			loadingIndex = 0,
			tabs = []
		} = this.properties;

		function nextIndex(i: number) {
			i = i === tabs.length - 1 ? 0 : i + 1;
			return i;
		}

		let i = nextIndex(this._loading ? loadingIndex : activeIndex);

		while (tabs[i].disabled) {
			i = nextIndex(i);
		}

		this.onTabClick(i);
	}

	private _previousTab() {
		const {
			activeIndex = 0,
			loadingIndex = 0,
			tabs = []
		} = this.properties;

		function previousIndex(i: number) {
			i = i === 0 ? tabs.length - 1 : i - 1;
			return i;
		}

		let i = previousIndex(this._loading ? loadingIndex : activeIndex);

		while (tabs[i].disabled) {
			i = previousIndex(i);
		}

		this.onTabClick(i);
	}

	private _renderTabButtons() {
		const {
			activeIndex = 0,
			loadingIndex,
			tabs = []
		} = this.properties;

		return tabs.map((tab, i) => {
			return w(TabButton, {
				active: i === (this._loading ? loadingIndex : activeIndex),
				closeable: tab.closeable,
				controls: `${ this._id }-tab-${i}`,
				disabled: tab.disabled,
				id: `${ this._id }-tabbutton-${i}`,
				index: i,
				key: String(i),
				loading: i === loadingIndex,
				onClick: this.onTabClick,
				onCloseClick: this.onCloseClick,
				onRightArrowPress: this._nextTab,
				onLeftArrowPress: this._previousTab,
				onEndPress: this._lastTab,
				onHomePress: this._firstTab
			}, [
				tab.label || null
			]);
		});
	}

	private _renderTabs() {
		const {
			activeIndex = 0,
			loadingIndex,
			tabs = []
		} = this.properties;

		return tabs
			.filter((tab, i) => {
				return i === (this._loading ? loadingIndex : activeIndex);
			})
			.map((tab, i) => w(Tab, {
				id: `${ this._id }-tab-${i}`,
				labelledBy: `${ this._id }-tabbutton-${i}`,
				loading: this._loading
			}, [
				this._loading ? 'Loading...' : (tab.content || null)
			]));
	}

	protected onTabClick(index: number) {
		console.log('requesting', index);
		const { onRequestTabChange } = this.properties;

		onRequestTabChange && onRequestTabChange(index);
	}

	protected onCloseClick(index: number) {
		const {
			tabs = [],
			onRequestTabClose
		} = this.properties;

		const newTabs = [...tabs];
		newTabs.splice(index, 1);

		onRequestTabClose && onRequestTabClose(newTabs);
	}

	protected updateActiveIndex() {
		const {
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
			this._loading = typeof evt.properties.loadingIndex === 'number';
		}
	}

	constructor() {
		super();

		this._id = uuid();
	}

	render(): DNode {
		const { alignButtons } = this.properties;

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
		let ariaAlign = 'horizontal';

		switch (alignButtons) {
			case Align.right:
				ariaAlign = 'vertical';
				alignClass = css.alignRight;
				children.reverse();
				break;
			case Align.bottom:
				alignClass = css.alignBottom;
				children.reverse();
				break;
			case Align.left:
				ariaAlign = 'vertical';
				alignClass = css.alignLeft;
				break;
		}

		return v('div', {
			'aria-orientation': ariaAlign,
			classes: this.classes(
				css.root,
				alignClass ? alignClass : null
			),
			role: 'tablist'
		}, children);
	}
}
