import { assign } from '@dojo/core/lang';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import { TabProperties } from './Tab';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import TabButton from './TabButton';
import uuid from '@dojo/core/uuid';

import * as css from './styles/tabPane.m.css';

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
 * @property alignButtons          Orientation of the tab buttons
 * @property onRequestTabChange    Called when a new tab button is clicked
 * @property onRequestTabClose     Called when a tab close button is clicked
 */
export interface TabPaneProperties extends ThemeableProperties {
	activeIndex: number;
	alignButtons?: Align;
	onRequestTabChange?(index: number, key: string): void;
	onRequestTabClose?(index: number, key: string): void;
};

export const TabPaneBase = ThemeableMixin(WidgetBase);
type Tab = WidgetBase<TabProperties>;

@theme(css)
export default class TabPane extends TabPaneBase<TabPaneProperties> {
	private _id: string;

	private get _tabs(): WNode<Tab>[] {
		return this.children.filter((child: WNode) => child !== null) as WNode<Tab>[];
	}

	private _onDownArrowPress() {
		const { alignButtons } = this.properties;

		if (alignButtons === Align.left || alignButtons === Align.right) {
			this.selectNextIndex();
		}
	}

	private _onLeftArrowPress() {
		this.selectPreviousIndex();
	}

	private _onRightArrowPress() {
		this.selectNextIndex();
	}

	private _onUpArrowPress() {
		const { alignButtons } = this.properties;

		if (alignButtons === Align.left || alignButtons === Align.right) {
			this.selectPreviousIndex();
		}
	}

	private _renderTabButtons() {
		return this._tabs.map((tab, i) => {
			const {
				closeable,
				disabled,
				key,
				label,
				theme = {}
			} = <TabProperties> tab.properties;

			return w(TabButton, {
				active: i === this.properties.activeIndex,
				closeable,
				controls: `${ this._id }-tab-${i}`,
				disabled,
				id: `${ this._id }-tabbutton-${i}`,
				index: i,
				key,
				onClick: this.selectIndex,
				onCloseClick: this.closeIndex,
				onEndPress: this.selectLastIndex,
				onHomePress: this.selectFirstIndex,
				onDownArrowPress: this._onDownArrowPress,
				onLeftArrowPress: this._onLeftArrowPress,
				onRightArrowPress: this._onRightArrowPress,
				onUpArrowPress: this._onUpArrowPress,
				theme
			}, [
				label || null
			]);
		});
	}

	private _renderTabs() {
		const { activeIndex } = this.properties;

		return this._tabs
			.filter((tab, i) => {
				return i === activeIndex;
			})
			.map((tab, i) => {
				assign(tab.properties, {
					id: `${ this._id }-tab-${i}`,
					labelledBy: `${ this._id }-tabbutton-${i}`
				});
				return tab;
			});
	}

	/**
	 * Determines if the tab at `currentIndex` is enabled. If disabled,
	 * returns the next valid index, or null if no enabled tabs exist.
	 */
	private _validateIndex(currentIndex: number, backwards?: boolean) {
		const tabs = this._tabs;

		if (tabs.every(result => Boolean(result.properties.disabled))) {
			return null;
		}

		function nextIndex(index: number) {
			if (backwards) {
				return (tabs.length + (index - 1)) % tabs.length;
			}
			return (index + 1) % tabs.length;
		}

		let i = !tabs[currentIndex] ? tabs.length - 1 : currentIndex;

		while (tabs[i].properties.disabled) {
			i = nextIndex(i);
		}

		return i;
	}

	protected closeIndex(index: number) {
		const { onRequestTabClose } = this.properties;
		const key = this._tabs[index].properties.key;

		onRequestTabClose && onRequestTabClose(index, key);
	}

	protected selectFirstIndex() {
		this.selectIndex(0, true);
	}

	protected selectIndex(index: number, backwards?: boolean) {
		const {
			activeIndex,
			onRequestTabChange
		} = this.properties;

		const validIndex = this._validateIndex(index, backwards);

		if (validIndex !== null && validIndex !== activeIndex) {
			const key = this._tabs[validIndex].properties.key;
			onRequestTabChange && onRequestTabChange(validIndex, key);
		}
	}

	protected selectLastIndex() {
		this.selectIndex(this._tabs.length - 1);
	}

	protected selectNextIndex() {
		const { activeIndex } = this.properties;

		this.selectIndex(activeIndex === this._tabs.length - 1 ? 0 : activeIndex + 1);
	}

	protected selectPreviousIndex() {
		const { activeIndex } = this.properties;

		this.selectIndex(activeIndex === 0 ? this._tabs.length - 1 : activeIndex - 1, true);
	}

	render(): DNode {
		const { activeIndex } = this.properties;
		const validIndex = this._validateIndex(activeIndex);

		if (validIndex !== null && validIndex !== activeIndex) {
			this.selectIndex(validIndex);
			return null;
		}

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

		switch (this.properties.alignButtons) {
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
