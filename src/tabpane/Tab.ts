import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/tabPane.m.css';

/**
 * @type TabProperties
 *
 * Properties that can be set on a Tab component
 *
 * @property id          ID of this underlying DOM element
 * @property labelledBy  ID of DOM element that serves as a label for this tab
 */
export interface TabProperties extends ThemeableProperties {
	id?: string;
	labelledBy?: string;
};

export const TabBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Tab extends TabBase<TabProperties> {
	render(): DNode {
		const {
			id,
			labelledBy
		} = this.properties;

		return v('div', {
			'aria-labelledby': labelledBy,
			classes: this.classes(css.tab),
			id,
			role: 'tabpanel'
		}, this.children);
	}
}
