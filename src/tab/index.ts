import { DNode } from '@dojo/framework/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { v } from '@dojo/framework/widget-core/d';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';

import * as css from '../theme/tab-controller.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { CustomElementChildType } from '@dojo/framework/widget-core/registerCustomElement';

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

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<TabProperties>({
	tag: 'dojo-tab',
	childType: CustomElementChildType.NODE,
	properties: [ 'theme', 'classes', 'aria', 'extraClasses', 'closeable', 'disabled', 'show' ],
	attributes: [ 'key', 'labelledBy', 'widgetId', 'label' ],
	events: [ ]
})
export class TabBase<P extends TabProperties = TabProperties> extends ThemedBase<P> {
	render(): DNode {
		const {
			aria = {},
			widgetId,
			labelledBy,
			show = false
		} = this.properties;

		return v('div', [
			v('div', {
				...formatAriaProperties(aria),
				'aria-labelledby': labelledBy,
				classes: this.theme([css.tab, !show ? css.hidden : null]),
				id: widgetId,
				role: 'tabpanel'
			}, this.children)
		]);
	}
}

export default class Tab extends TabBase<TabProperties> {}
