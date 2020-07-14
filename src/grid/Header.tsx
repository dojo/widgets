import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import Drag from '@dojo/framework/core/meta/Drag';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { ColumnConfig, SortOptions } from './interfaces';
import { DNode } from '@dojo/framework/core/interfaces';
import TextInput from '../text-input/index';
import Icon from '../icon/index';

import bundle from './nls/Grid';
import * as css from '../theme/default/grid-header.m.css';
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
	/** Configuration for grid columns (id, title, properties, and custom renderer) */
	columnConfig: ColumnConfig[];
	/** Handles changing the sort order of a column */
	sorter: (columnId: string, direction: 'asc' | 'desc') => void;
	/** Handles filtering rows based on a given column */
	filterer: (columnId: string, value: any) => void;
	/** Applied filters */
	filter?: {
		[index: string]: string;
	};
	/** Applied sort options */
	sort?: SortOptions;
	/** Custom column renderer for displaying sort options */
	sortRenderer?: SortRenderer;
	/** Custom renderer displaying applied filters */
	filterRenderer?: FilterRenderer;
	/** Callback on column resize */
	onColumnResize?: (index: number, value: number) => void;
	/** Calculated column widths */
	columnWidths?: { [index: string]: number };
}

@theme(css)
export default class Header extends I18nMixin(ThemedMixin(WidgetBase))<HeaderProperties> {
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
		const { format } = this.localizeBundle(bundle);
		return v('button', { classes: this.theme(css.sort), onclick: sorter }, [
			w(Icon, {
				theme,
				classes,
				type: direction === 'asc' ? 'upIcon' : 'downIcon',
				altText: format('sortBy', {
					name: this._getColumnTitle(column)
				})
			})
		]);
	};

	private _filterRenderer = (
		columnConfig: ColumnConfig,
		filterValue: string,
		doFilter: (value: string) => void,
		title?: string | DNode
	) => {
		const { theme, classes = {} } = this.properties;
		const { format } = this.localizeBundle(bundle);
		return w(
			TextInput,
			{
				key: 'filter',
				theme,
				classes: {
					...classes,
					'@dojo/widgets/text-input': {
						root: [this.theme(css.filter)],
						input: [this.theme(css.filterInput)],
						noLabel: [this.theme(css.filterNoLabel)],
						...classes['@dojo/widgets/text-input']
					}
				},
				labelHidden: true,
				type: 'search',
				initialValue: filterValue || undefined,
				onValue: doFilter
			},
			[{ label: format('filterBy', { name: title }) }]
		);
	};

	protected render(): DNode {
		const {
			columnConfig,
			sort,
			filterer,
			filter = {},
			sortRenderer = this._sortRenderer,
			filterRenderer = this._filterRenderer,
			columnWidths,
			onColumnResize
		} = this.properties;

		const rowWidth =
			columnWidths &&
			Object.keys(columnWidths).reduce((rowWidth, key) => {
				return rowWidth + columnWidths[key];
			}, 0);

		return v(
			'div',
			{
				styles: rowWidth ? { width: `${rowWidth}px` } : {},
				classes: [this.theme(css.root), fixedCss.rootFixed],
				role: 'row'
			},
			columnConfig.map((column, index) => {
				const title = this._getColumnTitle(column);
				let headerProperties = {};
				const isSorted = sort && sort.columnId === column.id;
				const isSortedAsc = Boolean(
					sort && sort.columnId === column.id && sort.direction === 'asc'
				);
				if (column.sortable) {
					headerProperties = {
						classes: [
							fixedCss.column,
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

				if (column.resizable) {
					const dragResults = this.meta(Drag).get(`${column.id}-resize`);

					if (dragResults.isDragging) {
						dragResults.delta.x !== 0 &&
							onColumnResize &&
							onColumnResize(index, dragResults.delta.x);
					}
				}

				return v(
					'div',
					{
						'aria-sort': isSorted
							? isSortedAsc
								? 'ascending'
								: 'descending'
							: undefined,
						classes: [this.theme(css.cell), fixedCss.cellFixed],
						role: 'columnheader',
						styles: columnWidths
							? {
									flex: `0 1 ${columnWidths[column.id]}px`
							  }
							: {}
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
							: null,
						column.resizable &&
							v('span', {
								key: `${column.id}-resize`,
								classes: [fixedCss.resize]
							})
					]
				);
			})
		);
	}
}
