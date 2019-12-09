import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';

import { ColumnConfig } from './interfaces';
import Cell from './Cell';
import * as fixedCss from './styles/row.m.css';
import * as css from '../theme/grid-row.m.css';

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
}

@theme(css)
export default class Row extends ThemedMixin(WidgetBase)<RowProperties> {
	protected render(): DNode {
		const { item, columnConfig, id, theme, classes, columnWidths } = this.properties;
		let columns = columnConfig.map(
			(config) => {
				let value: string | DNode = `${item[config.id]}`;
				if (config.renderer) {
					value = config.renderer({ value });
				}
				return w(Cell, {
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
				classes: [this.theme(css.root), fixedCss.rootFixed],
				role: 'row',
				'aria-rowindex': `${id + 1}`
			},
			columns
		);
	}
}
