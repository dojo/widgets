import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';

import { ColumnConfig } from './interfaces';
import Cell from './Cell';
import * as fixedCss from './styles/row.m.css';
import * as css from '../theme/default/grid-row.m.css';

export interface RowProperties {
	/** identifier for the row */
	id: number;
	/** A list of values indexed on the column id */
	item: { [index: string]: any };
	/** Configuration for grid columns (id, title, properties, and custom renderer)  */
	columnConfig: ColumnConfig[];
	/** Handles updating the value of a cell */
	updater: (rowNumber: number, columnId: string, value: any) => void;
	/** Calculated column widths */
	columnWidths?: { [index: string]: number };
	/** handler for row selection */
	onRowSelect?: (type: any) => void;
	/** array of selected rows */
	selected?: boolean;
}

@theme(css)
export default class Row extends I18nMixin(ThemedMixin(WidgetBase))<RowProperties> {
	private _onRowSelect(event: MouseEvent) {
		const { onRowSelect } = this.properties;
		const type = event.ctrlKey || event.metaKey ? 'multi' : 'single';
		onRowSelect && onRowSelect(type);
	}

	protected render(): DNode {
		const {
			i18nBundle,
			item,
			columnConfig,
			id,
			theme,
			classes,
			columnWidths,
			onRowSelect,
			selected
		} = this.properties;
		let columns = columnConfig.map(
			(config) => {
				let value: string | DNode = `${item[config.id]}`;
				if (config.renderer) {
					value = config.renderer({ value });
				}
				return w(Cell, {
					i18nBundle,
					theme,
					key: config.id,
					classes,
					updater: (updatedValue: string) => {
						this.properties.updater(id, config.id, updatedValue);
					},
					value,
					editable: config.editable,
					rawValue: `${item[config.id]}`,
					width: columnWidths ? columnWidths[config.id] : undefined
				});
			},
			[] as DNode[]
		);

		return v(
			'div',
			{
				key: 'root',
				classes: [
					this.theme(css.root),
					selected && this.theme(css.selected),
					fixedCss.rootFixed,
					onRowSelect && this.theme(css.selectable)
				],
				role: 'row',
				onclick: onRowSelect ? this._onRowSelect : undefined,
				'aria-rowindex': `${id + 1}`
			},
			columns
		);
	}
}
