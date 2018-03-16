import { assign } from '@dojo/core/lang';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import Tab, { TabProperties } from '../tab/index';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import TabButton from './TabButton';
import uuid from '@dojo/core/uuid';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';

import * as css from '../theme/tab-controller.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * Enum for tab button alignment
 */
export enum Align {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

/**
 * @type TabControllerProperties
 *
 * Properties that can be set on a TabController component
 *
 * @property activeIndex           Position of the currently active tab
 * @property alignButtons          Orientation of the tab buttons
 * @property onRequestTabChange    Called when a new tab button is clicked
 * @property onRequestTabClose     Called when a tab close button is clicked
 */
export interface TabControllerProperties extends ThemedProperties, CustomAriaProperties {
	activeIndex: number;
	alignButtons?: Align;
	onRequestTabChange?(index: number, key: string): void;
	onRequestTabClose?(index: number, key: string): void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<TabControllerProperties>({
	tag: 'dojo-tab-controller',
	properties: [ 'theme', 'aria', 'extraClasses', 'activeIndex' ],
	attributes: [ 'alignButtons' ],
	events: [
		'onRequestTabChange',
		'onRequestTabClose'
	]
})
export class TabControllerBase<P extends TabControllerProperties = TabControllerProperties> extends ThemedBase<P, WNode<Tab>> {
	private _id = uuid();
	private _callTabFocus = false;

	private get _tabs(): WNode<Tab>[] {
		return this.children.filter(child => child !== null) as WNode<Tab>[];
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
		this._callTabFocus = true;

		onRequestTabClose && onRequestTabClose(index, key);
	}

	protected renderButtonContent(label?: DNode): DNode[] {
		return [ label || null ];
	}

	protected renderTabButtons(): DNode[] {
		return this._tabs.map((tab, i) => {
			const {
				closeable,
				disabled,
				key,
				label,
				theme
			} = <TabProperties> tab.properties;

			return w(TabButton, {
				callFocus: this._callTabFocus &&  i === this.properties.activeIndex,
				active: i === this.properties.activeIndex,
				closeable,
				controls: `${ this._id }-tab-${i}`,
				disabled,
				id: `${ this._id }-tabbutton-${i}`,
				index: i,
				key: `${ key }-tabbutton`,
				onClick: this.selectIndex,
				onCloseClick: this.closeIndex,
				onDownArrowPress: this._onDownArrowPress,
				onEndPress: this.selectLastIndex,
				onFocusCalled: () => { this._callTabFocus = false; },
				onHomePress: this.selectFirstIndex,
				onLeftArrowPress: this._onLeftArrowPress,
				onRightArrowPress: this._onRightArrowPress,
				onUpArrowPress: this._onUpArrowPress,
				theme
			}, this.renderButtonContent(label));
		});
	}

	protected renderTabs(): DNode[] {
		const { activeIndex } = this.properties;

		return this._tabs
			.map((tab, i) => {
				assign(tab.properties, {
					id: `${ this._id }-tab-${i}`,
					labelledBy: `${ this._id }-tabbutton-${i}`,
					show: i === activeIndex
				});
				return tab;
			});
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
		this._callTabFocus = true;

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
		const { activeIndex, aria = {} } = this.properties;
		const validIndex = this._validateIndex(activeIndex);
		const tabs = this.renderTabs();

		if (validIndex !== null && validIndex !== activeIndex) {
			this.selectIndex(validIndex);
			return null;
		}

		const children = [
			v('div', {
				key: 'buttons',
				classes: this.theme(css.tabButtons)
			}, this.renderTabButtons()),
			tabs.length ? v('div', {
				key: 'tabs',
				classes: this.theme(css.tabs)
			}, tabs) : null
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
			...formatAriaProperties(aria),
			'aria-orientation': orientation,
			classes: this.theme([
				alignClass ? alignClass : null,
				css.root
			]),
			role: 'tablist'
		}, children);
	}
}

export default class TabController extends TabControllerBase<TabControllerProperties> {}
