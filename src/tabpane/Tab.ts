import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/tabPane.css';

/**
 * @type TabProperties
 *
 * Properties that can be set on a Tab component
 *
 * @property active		Dertermines whether this tab is selected
 * @property loading		Determines whether the associated tab is loading
 */
export interface TabProperties extends ThemeableProperties {
	active?: boolean;
	loading?: boolean;
};

export const TabBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Tab extends TabBase<TabProperties> {
	render(): DNode {
		const { loading } = this.properties;

		return v('div', {
			classes: this.classes(
				css.tab,
				loading ? css.loading : null
			)
		}, this.children);
	}
}
