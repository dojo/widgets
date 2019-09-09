import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';

import * as css from '../theme/tab-controller.m.css';

/**
 * @type TabProperties
 *
 * Properties that can be set on a Tab component
 *
 * @property closeable    Determines whether this tab can be closed
 * @property disabled     Determines whether this tab can become active
 * @property widgetId       ID of this underlying DOM element
 * @property key          A unique identifier for this Tab within the TabController
 * @property label        Content to show in the TabController control bar for this tab
 * @property labelledBy   ID of DOM element that serves as a label for this tab
 */
export interface TabProperties extends ThemedProperties, CustomAriaProperties {
	closeable?: boolean;
	disabled?: boolean;
	widgetId?: string;
	key: string;
	label?: DNode;
	show?: boolean;
	labelledBy?: string;
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
				classes: this.theme([css.tab]),
				id: widgetId,
				role: 'tabpanel'
			},
			[v('div', { classes: [hidden] }, this.children)]
		);
	}
}

export default Tab;
