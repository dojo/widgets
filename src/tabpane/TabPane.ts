import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { includes } from '@dojo/shim/array';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/tabPane.css';
import Tab from './Tab';
import TabButton from './TabButton';

export type TabConfig = {
	label?: DNode;
	content?: DNode;
	disabled?: boolean;
	closeable?: boolean;
};

/**
 * @type TabPaneProperties
 *
 * Properties that can be set on a TabPane component
 * 
 * @property activeIndex 			Position of the currently-active tab
 * @property tabs 					List of tab configuration objects
 * @property onRequestTabChange		Called when a new tab button is clicked
 * @property onRequestTabClose		Called when a tab close button is clicked
 */
export interface TabPaneProperties extends ThemeableProperties {
	activeIndex?: number;
	tabs?: TabConfig[];
	onRequestTabChange?(index: number): void;
	onRequestTabClose?(tabs: TabConfig[]): void;
};

export const TabPaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TabPane extends TabPaneBase<TabPaneProperties> {
	onTabClick(index: number) {
		const { onRequestTabChange } = this.properties;
		onRequestTabChange && onRequestTabChange(index);
	}

	onCloseClick(index: number) {
		let {
			tabs = [],
			onRequestTabClose
		} = this.properties;

		const newTabs = tabs.slice();
		newTabs.splice(index, 1);

		onRequestTabClose && onRequestTabClose(newTabs);
	}

	renderTabButtons() {
		const {
			activeIndex = 0,
			tabs = []
		} = this.properties;

		return tabs.map((tab, i) => w(TabButton, {
			key: String(i),
			active: i === activeIndex,
			closeable: tab.closeable,
			disabled: tab.disabled,
			index: i,
			onClick: this.onTabClick,
			onCloseClick: this.onCloseClick
		}, [ tab.label || null ]));
	}

	renderTabs() {
		const {
			activeIndex = 0,
			tabs = []
		} = this.properties;

		return tabs.filter((tab, i) => {
			return i === activeIndex;
		}).map(tab => w(Tab, {
			active: true
		}, [ tab.content || null ]));
	}

	updateActiveIndex() {
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
			}
		}
	}

	@onPropertiesChanged
	onPropertiesChanged(evt: PropertiesChangeEvent<this, TabPaneProperties>) {
		if (includes(evt.changedPropertyKeys, 'tabs') || includes(evt.changedPropertyKeys, 'activeIndex')) {
			this.updateActiveIndex();
		}
	}

	render(): DNode {
		return v('div', {
			classes: this.classes(css.root)
		}, [
			v('div', this.renderTabButtons()),
			v('div', this.renderTabs())
		]);
	}
}
