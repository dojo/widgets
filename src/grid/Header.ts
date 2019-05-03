import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import { ColumnConfig, FilterOptions, SortOptions } from './interfaces';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import TextInput from '../text-input/index';
import Icon from '../icon/index';

import * as css from '../theme/grid-header.m.css';
import * as fixedCss from './styles/header.m.css';

export interface SortRenderer {
	(column: ColumnConfig, direction: undefined | 'asc' | 'desc', sorter: () => void): DNode;
}

export interface FilterRenderer {
	(
		column: ColumnConfig,
		filterValue: string,
		doFilter: (value: string) => void,
		title?: string | DNode
	): DNode;
}

export interface HeaderProperties {
	columnConfig: ColumnConfig[];
	sorter: (columnId: string, direction: 'asc' | 'desc') => void;
	filterer: (columnId: string, value: any) => void;
	filter?: {
		[index: string]: string;
	};
	sort?: SortOptions;
	sortRenderer?: SortRenderer;
	filterRenderer?: FilterRenderer;
}

@theme(css)
export default class Header extends ThemedMixin(WidgetBase)<HeaderProperties> {
	private _getColumnTitle(column: ColumnConfig): string | DNode {
		if (typeof column.title === 'function') {
			return column.title();
		}
		return column.title;
	}

	private _sortColumn(id: string) {
		const { sort, sorter } = this.properties;
		const direction = sort
			? sort.columnId !== id
				? 'desc'
				: sort.direction === 'desc'
				? 'asc'
				: 'desc'
			: 'desc';
		sorter(id, direction);
	}

	private _sortRenderer = (
		column: ColumnConfig,
		direction: undefined | 'asc' | 'desc',
		sorter: () => void
	) => {
		const { theme, classes } = this.properties;
		return v('button', { classes: this.theme(css.sort), onclick: sorter }, [
			w(Icon, {
				theme,
				classes,
				type: direction === 'asc' ? 'upIcon' : 'downIcon',
				altText: `Sort by ${this._getColumnTitle(column)}`
			})
		]);
	};

	private _filterRenderer = (
		columnConfig: ColumnConfig,
		filterValue: string,
		doFilter: (value: string) => void,
		title?: string | DNode
	) => {
		const { theme, classes } = this.properties;
		return w(TextInput, {
			key: 'filter',
			theme,
			classes,
			extraClasses: { root: css.filter },
			label: `Filter by ${title}`,
			labelHidden: true,
			type: 'search',
			value: filterValue,
			onInput: doFilter
		});
	};

	protected render(): DNode {
		const {
			columnConfig,
			sorter,
			sort,
			filterer,
			filter = {},
			theme,
			classes,
			sortRenderer = this._sortRenderer,
			filterRenderer = this._filterRenderer
		} = this.properties;

		return v(
			'div',
			{ classes: [this.theme(css.root), fixedCss.rootFixed], role: 'row' },
			columnConfig.map((column) => {
				const title = this._getColumnTitle(column);
				let headerProperties = {};
				const isSorted = sort && sort.columnId === column.id;
				const isSortedAsc = Boolean(
					sort && sort.columnId === column.id && sort.direction === 'asc'
				);
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

				const filterKeys = Object.keys(filter);
				const direction = !isSorted ? undefined : isSortedAsc ? 'asc' : 'desc';
				const filterValue = filterKeys.indexOf(column.id) > -1 ? filter[column.id] : '';
				const doFilter = (value: string) => {
					filterer(column.id, value);
				};

				return v(
					'div',
					{
						'aria-sort': isSorted ? (isSortedAsc ? 'ascending' : 'descending') : null,
						classes: [this.theme(css.cell), fixedCss.cellFixed],
						role: 'columnheader'
					},
					[
						v('div', headerProperties, [
							title,
							column.sortable
								? sortRenderer(column, direction, () => {
										this._sortColumn(column.id);
								  })
								: null
						]),
						column.filterable
							? filterRenderer(column, filterValue, doFilter, title)
							: null
					]
				);
			})
		);
	}
}
