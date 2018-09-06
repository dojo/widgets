import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { ColumnConfig, FilterOptions, SortOptions } from './../interfaces';
import { DNode } from '@dojo/framework/widget-core/interfaces';

import * as css from './styles/Header.m.css';

export interface HeaderProperties {
	columnConfig: ColumnConfig[];
	sorter: (columnId: string, direction: 'asc' | 'desc') => void;
	filterer: (columnId: string, value: any) => void;
	filter?: FilterOptions;
	sort?: SortOptions;
	scrollLeft: number;
}

@theme(css)
export default class Header extends ThemedMixin(WidgetBase)<HeaderProperties> {
	protected render(): DNode {
		const { columnConfig, sorter, sort, filterer, scrollLeft, filter } = this.properties;
		const hasFilters = columnConfig.some((config) => !!config.filterable);
		return v('div', { scrollLeft, classes: [css.root, hasFilters ? css.filterGroup : null], row: 'rowgroup' }, [
			v(
				'div',
				{ classes: css.row, role: 'role' },
				columnConfig.map((column) => {
					let title: string | DNode;
					if (typeof column.title === 'function') {
						title = column.title();
					} else {
						title = column.title;
					}
					let headerProperties = {};
					if (column.sortable) {
						headerProperties = {
							classes: [
								css.sortable,
								sort && sort.columnId === column.id ? css.sorted : null,
								sort && sort.columnId === column.id && sort.direction === 'desc' ? css.desc : null,
								sort && sort.columnId === column.id && sort.direction === 'asc' ? css.asc : null
							],
							onclick: () => {
								const direction = sort
									? sort.columnId !== column.id ? 'desc' : sort.direction === 'desc' ? 'asc' : 'desc'
									: 'desc';
								sorter(column.id, direction);
							}
						};
					}

					return v('div', { classes: css.cell, role: 'columnheader' }, [
						v('div', headerProperties, [title]),
						column.filterable
							? v('input', {
									classes: css.filter,
									value: filter && filter.columnId === column.id ? filter.value : '',
									oninput: (event: KeyboardEvent) => {
										const target = event.target as HTMLInputElement;
										filterer(column.id, target.value);
									}
								})
							: null
					]);
				})
			)
		]);
	}
}
