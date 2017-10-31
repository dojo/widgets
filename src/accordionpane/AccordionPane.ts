import { after } from '@dojo/core/aspect';
import { assign } from '@dojo/core/lang';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import TitlePane from '../titlepane/TitlePane';

import * as css from './styles/accordionPane.m.css';

/**
 * @type AccordionPaneProperties
 *
 * Properties that can be set on AccordionPane components
 *
 * @property onRequestClose   Called when the title of an open pane is clicked
 * @property onRequestOpen    Called when the title of a closed pane is clicked
 * @property openKeys         Array of TitlePane keys indicating which panes should be open
 */
export interface AccordionPaneProperties extends ThemeableProperties {
	onRequestClose?(key: string): void;
	onRequestOpen?(key: string): void;
	openKeys?: string[];
};

export const AccordionPaneBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class AccordionPane extends AccordionPaneBase<AccordionPaneProperties, WNode<TitlePane>> {
	private _assignCallback(child: WNode<TitlePane>, functionName: 'onRequestClose' | 'onRequestOpen', callback: (key: string) => void) {
		const existingProperty = child.properties[functionName];
		const property = () => { callback.call(this, `${ child.properties.key }`); };

		return existingProperty ? after(existingProperty, property) : property;
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
			theme
		} = this.properties;

		return this.children.filter((child) => child).map(child => {
			// null checks skipped since children are filtered prior to mapping
			assign(child!.properties, {
				onRequestClose: this._assignCallback(child!, 'onRequestClose', this.onRequestClose),
				onRequestOpen: this._assignCallback(child!, 'onRequestOpen', this.onRequestOpen),
				open: includes(openKeys, child!.properties.key),
				theme
			});

			return child;
		});
	}

	render(): DNode {
		return v('div', { classes: this.classes(css.root) }, this.renderChildren());
	}
}
