import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { ColumnConfig, FilterOptions, SortOptions } from './../interfaces';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import TextInput from '../../text-input/index';
import Icon from '../../icon/index';

import * as css from '../../theme/grid-header.m.css';
import * as fixedCss from '../styles/header.m.css';

export interface HeaderProperties {
	columnConfig: ColumnConfig[];
	sorter: (columnId: string, direction: 'asc' | 'desc') => void;
	filterer: (columnId: string, value: any) => void;
	filter?: FilterOptions;
	sort?: SortOptions;
}

@theme(css)
export default class Header extends ThemedMixin(WidgetBase)<HeaderProperties> {
	private _sortColumn(id: string) {
		const { sort, sorter } = this.properties;
		const direction = sort
			? sort.columnId !== id ? 'desc' : sort.direction === 'desc' ? 'asc' : 'desc'
			: 'desc';
		sorter(id, direction);
	}

	protected render(): DNode {
		const { columnConfig, sorter, sort, filterer, filter, theme } = this.properties;
		return v('div', { classes: [this.theme(css.root), fixedCss.rootFixed], role: 'row' },
			columnConfig.map((column) => {
				let title: string | DNode;
				if (typeof column.title === 'function') {
					title = column.title();
				} else {
					title = column.title;
				}
				let headerProperties = {};
				const isSorted = sort && sort.columnId === column.id;
				const isSortedAsc = sort && sort.columnId === column.id && sort.direction === 'asc';
				if (column.sortable) {
					headerProperties = {
						classes: [
							this.theme(css.sortable),
							isSorted ? this.theme(css.sorted) : null,
							isSorted && !isSortedAsc ? this.theme(css.desc) : null,
							isSortedAsc ? this.theme(css.asc) : null
						],
						onclick: () => {
							this._sortColumn(column.id);
						}
					};
				}

				return v('div', {
					'aria-sort': isSorted ? isSortedAsc ? 'ascending' : 'descending' : null,
					classes: [this.theme(css.cell), fixedCss.cellFixed],
					role: 'columnheader'
				}, [
					v('div', headerProperties, [
						title,
						column.sortable ? v('button', {
							classes: this.theme(css.sort),
							onclick: () => {
								this._sortColumn(column.id);
							}
						}, [
							w(Icon, {
								theme,
								type: sort && sort.columnId === column.id && sort.direction === 'asc' ? 'upIcon' : 'downIcon',
								altText: `Sort by ${title}`
							})
						])
						: null
					]),
					column.filterable
						? w(TextInput, {
							theme,
							key: 'filter',
							extraClasses: { root: css.filter },
							label: `Filter by ${title}`,
							labelHidden: true,
							type: 'search',
							value: filter && filter.columnId === column.id ? filter.value : '',
							onInput: (value: string) => {
								filterer(column.id, value);
							}
						})
						: null
				]);
			})
		);
	}
}
