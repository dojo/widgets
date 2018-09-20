import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { ColumnConfig, FilterOptions, SortOptions } from './../interfaces';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import TextInput from '../../text-input/index';
import Icon from '../../icon/index';

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
	private _sortColumn(id: string) {
		const { sort, sorter } = this.properties;
		const direction = sort
			? sort.columnId !== id ? 'desc' : sort.direction === 'desc' ? 'asc' : 'desc'
			: 'desc';
		sorter(id, direction);
	}

	protected render(): DNode {
		const { columnConfig, sorter, sort, filterer, scrollLeft, filter } = this.properties;
		const hasFilters = columnConfig.some((config) => !!config.filterable);
		return v('div', { scrollLeft, classes: [css.root, hasFilters ? css.filterGroup : null], row: 'rowgroup' }, [
			v('div', { classes: css.row, role: 'row' },
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
								this._sortColumn(column.id);
							}
						};
					}

					return v('div', { classes: css.cell, role: 'columnheader' }, [
						v('div', headerProperties, [
							title,
							column.sortable ? v('button', {
								classes: css.sort,
								onclick: () => {
									this._sortColumn(column.id);
								}
							}, [
								w(Icon, {
									type: sort && sort.columnId === column.id && sort.direction === 'asc' ? 'upIcon' : 'downIcon',
									altText: `Sort by ${title}`
								})
							])
							: null
						]),
						column.filterable
							? w(TextInput, {
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
			)
		]);
	}
}
