import { assign } from '@dojo/framework/shim/object';
import { DNode, WNode } from '@dojo/framework/widget-core/interfaces';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import { includes } from '@dojo/framework/shim/array';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { v } from '@dojo/framework/widget-core/d';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';

import TitlePane from '../title-pane/index';
import * as css from '../theme/accordion-pane.m.css';

/**
 * @type AccordionPaneProperties
 *
 * Properties that can be set on AccordionPane components
 *
 * @property onRequestClose   Called when the title of an open pane is clicked
 * @property onRequestOpen    Called when the title of a closed pane is clicked
 * @property openKeys         Array of TitlePane keys indicating which panes should be open
 */
export interface AccordionPaneProperties extends ThemedProperties {
	onRequestClose?(key: string): void;
	onRequestOpen?(key: string): void;
	openKeys?: string[];
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<AccordionPaneProperties>({
	tag: 'dojo-accordion-pane',
	properties: [ 'openKeys', 'theme', 'extraClasses', 'classes' ],
	events: [ 'onRequestClose', 'onRequestOpen' ]
})
export class AccordionPaneBase<P extends AccordionPaneProperties = AccordionPaneProperties> extends ThemedBase<P, WNode<TitlePane>> {
	private _assignCallback(child: WNode<TitlePane>, functionName: 'onRequestClose' | 'onRequestOpen', callback: (key: string) => void) {
		const existingProperty = child.properties[functionName];
		const property = () => { callback.call(this, `${ child.properties.key }`); };

		return existingProperty ? (key: string) => {
			existingProperty(key);
			property();
		} : property;
	}

	protected onRequestClose(key: string) {
		const { onRequestClose } = this.properties;
		onRequestClose && onRequestClose(key);
	}

	protected onRequestOpen(key: string) {
		const { onRequestOpen } = this.properties;
		onRequestOpen && onRequestOpen(key);
	}

	protected renderChildren(): DNode[] {
		const {
			openKeys = [],
			theme,
			classes
		} = this.properties;

		return this.children.filter((child) => child).map(child => {
			// null checks skipped since children are filtered prior to mapping
			assign(child!.properties, {
				onRequestClose: this._assignCallback(child!, 'onRequestClose', this.onRequestClose),
				onRequestOpen: this._assignCallback(child!, 'onRequestOpen', this.onRequestOpen),
				open: includes(openKeys, child!.properties.key),
				theme,
				classes
			});

			return child;
		});
	}

	protected render(): DNode {
		return v('div', { classes: this.theme(css.root) }, this.renderChildren());
	}
}

export default class AccordionPane extends AccordionPaneBase<AccordionPaneProperties> {}
