import { assign } from '@dojo/framework/shim/object';
import { DNode, WNode } from '@dojo/framework/core/interfaces';
import { includes } from '@dojo/framework/shim/array';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';

import TitlePane from '../title-pane/index';
import * as css from '../theme/default/accordion-pane.m.css';

export interface AccordionPaneProperties extends ThemedProperties {
	/** Called when the title of an open pane is clicked */
	onRequestClose?(key: string): void;
	/** Called when the title of a closed pane is clicked */
	onRequestOpen?(key: string): void;
	/** Array of TitlePane keys indicating which panes should be open */
	openKeys?: string[];
}

@theme(css)
export class AccordionPane extends ThemedMixin(WidgetBase)<
	AccordionPaneProperties,
	WNode<TitlePane>
> {
	private _assignCallback(
		child: WNode<TitlePane>,
		functionName: 'onRequestClose' | 'onRequestOpen',
		callback: (key: string) => void
	) {
		const existingProperty = child.properties[functionName];
		const property = () => {
			callback.call(this, `${child.properties.key}`);
		};

		return existingProperty
			? (key: string) => {
					existingProperty(key);
					property();
			  }
			: property;
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
		const { openKeys = [], theme, classes } = this.properties;
		const length = this.children.length;
		return this.children
			.filter((child) => child)
			.map((child, index) => {
				const passedTitlePaneClasses =
					(classes && classes['@dojo/widgets/title-pane']) || {};
				const open = includes(openKeys, child!.properties.key);

				// null checks skipped since children are filtered prior to mapping
				assign(child!.properties, {
					onRequestClose: this._assignCallback(
						child!,
						'onRequestClose',
						this.onRequestClose
					),
					onRequestOpen: this._assignCallback(
						child!,
						'onRequestOpen',
						this.onRequestOpen
					),
					open,
					theme,
					classes: {
						...classes,
						'@dojo/widgets/title-pane': {
							root: this.theme([
								css.rootTitlePane,
								open ? css.openTitlePane : null,
								index === 0 ? css.firstTitlePane : null,
								index === length - 1 ? css.lastTitlePane : null
							]),
							...passedTitlePaneClasses
						}
					}
				});

				return child;
			});
	}

	protected render(): DNode {
		return v('div', { classes: this.theme(css.root) }, this.renderChildren());
	}
}

export default AccordionPane;
