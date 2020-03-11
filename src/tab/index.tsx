import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { formatAriaProperties } from '../common/util';

import * as css from '../theme/default/tab-controller.m.css';

export interface TabProperties extends ThemedProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Determines whether this tab can be closed */
	closeable?: boolean;
	/** Determines whether this tab can become active */
	disabled?: boolean;
	/** A unique identifier for this Tab within the TabController */
	key: string;
	/** Content to show in the TabController control bar for this tab */
	label?: DNode;
	/** ID of DOM element that serves as a label for this tab */
	labelledBy?: string;
	/** If the tab should be shown */
	show?: boolean;
	/** ID of this underlying DOM element */
	widgetId?: string;
}

@theme(css)
export class Tab extends ThemedMixin(WidgetBase)<TabProperties> {
	render(): DNode {
		const { aria = {}, widgetId, labelledBy, show = false } = this.properties;

		const hidden = this.theme(!show ? css.hidden : null);

		return v(
			'div',
			{
				...formatAriaProperties(aria),
				'aria-labelledby': labelledBy,
				classes: [this.variant(), ...this.theme([css.tab])],
				id: widgetId,
				role: 'tabpanel'
			},
			[v('div', { classes: [hidden] }, this.children)]
		);
	}
}

export default Tab;
