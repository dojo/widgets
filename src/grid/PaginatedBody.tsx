import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode } from '@dojo/framework/core/interfaces';

import { GridPages, ColumnConfig, SelectionType } from './interfaces';
import PlaceholderRow from './PlaceholderRow';
import Row from './Row';

import * as fixedCss from './styles/body.m.css';
import * as css from '../theme/default/grid-body.m.css';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import { reference } from '@dojo/framework/core/diff';

export interface PaginatedBodyProperties<S> {
	/** The current page number */
	pageNumber: number;
	/** A list of paginated grids */
	pages: GridPages<S>;
	/** The height (in pixels) */
	height: number;
	/** The width (in pixels) */
	width?: number;
	/** The number of elements to a page */
	pageSize: number;
	/** Configuration for grid columns (id, title, properties, and custom renderer) */
	columnConfig: ColumnConfig[];
	/** Custom renderer for the placeholder row used while data is loaded */
	placeholderRowRenderer?: (index: number) => DNode;
	/** Used to fetch additional pages of information */
	fetcher: (page: number, pageSize: number) => void;
	/** Called when a cell is updated */
	updater: (page: number, rowNumber: number, columnId: string, value: string) => void;
	/** Handler for scroll events */
	onScroll: (value: number) => void;
	/** Calculated column widths */
	columnWidths?: { [index: string]: number };
	/** handler for row selection */
	onRowSelect?: (index: number, type: SelectionType) => void;
	/** array of selected rows */
	selectedRows?: number[];
}

@theme(css)
@diffProperty('pages', reference)
export default class PaginatedBody<S> extends I18nMixin(ThemedMixin(WidgetBase))<
	PaginatedBodyProperties<S>
> {
	private _defaultPlaceholderRow(key: number) {
		const { classes, theme } = this.properties;
		return w(PlaceholderRow, { key, theme, classes });
	}

	private _updater(rowNumber: number, columnId: string, value: any) {
		const page = Math.max(Math.ceil(rowNumber / this.properties.pageSize), 1);
		const pageItemNumber = rowNumber - (page - 1) * this.properties.pageSize;
		this.properties.updater(page, pageItemNumber, columnId, value);
	}

	private _onScroll(event: UIEvent) {
		const scrollLeft = (event.target as HTMLElement).scrollLeft;
		this.properties.onScroll(scrollLeft);
	}

	private _renderRows() {
		const {
			i18nBundle,
			pageSize,
			fetcher,
			pages,
			columnConfig,
			placeholderRowRenderer = this._defaultPlaceholderRow,
			pageNumber,
			theme,
			classes,
			columnWidths,
			onRowSelect,
			selectedRows = []
		} = this.properties;
		let data = pages[`page-${pageNumber}`];
		if (!data) {
			fetcher(pageNumber, pageSize);
		}
		let rows: DNode[] = [];
		const rowCount = data ? data.length : pageSize;
		for (let i = 0; i < rowCount; i++) {
			if (!data) {
				rows.push(placeholderRowRenderer(i));
			} else {
				rows.push(
					w(Row, {
						id: i,
						key: i,
						i18nBundle,
						theme,
						classes,
						item: data[i],
						columnConfig,
						columnWidths,
						updater: this._updater,
						onRowSelect: onRowSelect
							? (type: SelectionType) => {
									onRowSelect && onRowSelect(i, type);
							  }
							: undefined,
						selected: selectedRows.indexOf(i) !== -1
					})
				);
			}
		}
		return rows;
	}

	protected render(): DNode {
		const { height, width, columnWidths } = this.properties;

		const rowWidth =
			columnWidths &&
			Object.keys(columnWidths).reduce((rowWidth, key) => {
				return rowWidth + columnWidths[key];
			}, 0);

		return v(
			'div',
			{
				key: 'root',
				classes: [this.theme(css.root), fixedCss.rootFixed],
				role: 'rowgroup',
				onscroll: this._onScroll,
				styles: width
					? { height: `${height}px`, width: `${width}px` }
					: { height: `${height}px` }
			},
			[
				v('div', { styles: rowWidth ? { width: `${rowWidth}px` } : {} }, [
					v('div'),
					...this._renderRows()
				])
			]
		);
	}
}
