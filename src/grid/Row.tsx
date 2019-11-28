import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';

import { ColumnConfig } from './interfaces';
import Cell from './Cell';
import * as fixedCss from './styles/row.m.css';
import * as css from '../theme/default/grid-row.m.css';

export interface RowProperties {
	id: number;
	item: { [index: string]: any };
	columnConfig: ColumnConfig[];
	updater: (rowNumber: number, columnId: string, value: any) => void;
}

@theme(css)
export default class Row extends ThemedMixin(WidgetBase)<RowProperties> {
	protected render(): DNode {
		const { item, columnConfig, id, theme, classes } = this.properties;
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
					rawValue: `${item[config.id]}`
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
