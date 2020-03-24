import global from '@dojo/framework/shim/global';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import I18nMixin from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode, VNodeProperties } from '@dojo/framework/core/interfaces';
import renderer from '@dojo/framework/core/vdom';

import { GridPages, ColumnConfig, SelectionType } from './interfaces';
import PlaceholderRow from './PlaceholderRow';
import Row from './Row';

import * as fixedCss from './styles/body.m.css';
import * as css from '../theme/default/grid-body.m.css';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import { auto, reference } from '@dojo/framework/core/diff';

export interface BodyProperties<S> {
	/** The total number of rows */
	totalRows?: number;
	/** The number of elements to a page */
	pageSize: number;
	/** A list of paginated grids */
	pages: GridPages<S>;
	/** The height (in pixels) */
	height: number;
	/** The width (in pixels) */
	width?: number;
	/** Configuration for grid columns (id, title, properties, and custom renderer) */
	columnConfig: ColumnConfig[];
	/** Custom renderer for the placeholder row used while data is loaded */
	placeholderRowRenderer?: (index: number) => DNode;
	/** Used to fetch additional pages of information */
	fetcher: (page: number, pageSize: number) => void;
	/** Called when a cell is updated */
	updater: (page: number, rowNumber: number, columnId: string, value: string) => void;
	/** Called when the page changes */
	pageChange: (page: number) => void;
	/** Handler for scroll events */
	onScroll?: (value: number) => void;
	/** Calculated column widths */
	columnWidths?: { [index: string]: number };
	/** handler for row selection */
	onRowSelect?: (index: number, type: SelectionType) => void;
	/** array of selected rows */
	selectedRows?: number[];
}

const offscreen = (dnode: DNode) => {
	const r = renderer(() =>
		w(
			class extends WidgetBase {
				render() {
					return dnode;
				}
			},
			{}
		)
	);
	const div = global.document.createElement('div');
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions;
};

@theme(css)
@diffProperty('pages', reference)
export default class Body<S> extends I18nMixin(ThemedMixin(WidgetBase))<BodyProperties<S>> {
	private _rowHeight!: number;
	private _rowsInView!: number;
	private _renderPageSize!: number;
	private _start = 0;
	private _end = 100;
	private _resetScroll = false;

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
		const { totalRows = 0, onScroll } = this.properties;
		const scrollTop = (event.target as HTMLElement).scrollTop;
		const scrollLeft = (event.target as HTMLElement).scrollLeft;
		const topRow = Math.round(scrollTop / this._rowHeight);
		const bottomRow = topRow + this._rowsInView;
		if (topRow <= this._start) {
			this._start = Math.max(0, topRow - this._renderPageSize);
			this._end = Math.min(totalRows, this._start + this._renderPageSize * 2);
		}
		if (bottomRow >= this._end) {
			this._start = Math.min(topRow, totalRows - this._renderPageSize);
			this._end = Math.min(totalRows, this._start + this._renderPageSize * 2);
		}
		onScroll && onScroll(scrollLeft);
		this.invalidate();
	}

	@diffProperty('totalRows', auto)
	protected _onDiffTotalRows() {
		this._start = 0;
		this._end = 100;
		this._resetScroll = true;
	}

	private _renderRows(start: number, end: number) {
		const {
			i18nBundle,
			pageSize,
			fetcher,
			pages,
			columnConfig,
			placeholderRowRenderer = this._defaultPlaceholderRow,
			pageChange,
			totalRows,
			theme,
			classes,
			columnWidths,
			onRowSelect,
			selectedRows = []
		} = this.properties;

		const startPage = Math.max(Math.ceil(start / pageSize), 1);
		const endPage = Math.ceil(end / pageSize);

		let data = pages[`page-${startPage}`] || [];

		if (!data.length && (totalRows === undefined || totalRows > 0)) {
			fetcher(startPage, pageSize);
		}

		if (startPage !== endPage) {
			const endData = pages[`page-${endPage}`] || [];
			if (!endData.length) {
				fetcher(endPage, pageSize);
			}
			const midScreenPage = Math.max(Math.ceil((start + this._rowsInView / 2) / pageSize), 1);
			pageChange(midScreenPage);
			data = [...data, ...endData];
		} else {
			pageChange(startPage);
		}

		const rows: DNode[] = [];

		for (let i = start; i < end; i++) {
			const offset = i - (startPage * pageSize - pageSize);
			const item = data[offset];
			if (item) {
				rows.push(
					w(Row, {
						id: i,
						key: i,
						i18nBundle,
						theme,
						classes,
						item,
						columnConfig,
						updater: this._updater,
						columnWidths,
						onRowSelect: onRowSelect
							? (type: SelectionType) => {
									onRowSelect(i, type);
							  }
							: undefined,
						selected: selectedRows.indexOf(i) !== -1
					})
				);
			} else {
				if (totalRows === undefined || (i > -1 && i < totalRows)) {
					rows.push(placeholderRowRenderer(i));
				}
			}
		}

		return rows;
	}

	protected render(): DNode {
		const {
			placeholderRowRenderer = this._defaultPlaceholderRow,
			totalRows = 0,
			pageSize,
			height,
			width,
			columnWidths
		} = this.properties;

		const rowWidth =
			columnWidths &&
			Object.keys(columnWidths).reduce((rowWidth, key) => {
				return rowWidth + columnWidths[key];
			}, 0);

		if (!this._rowHeight) {
			const firstRow = placeholderRowRenderer(0);
			const dimensions = offscreen(firstRow);
			this._rowHeight = dimensions.height;
			this._rowsInView = Math.ceil(height / this._rowHeight);
			this._renderPageSize = this._rowsInView * 2;
		}

		const rows: DNode[] = this._renderRows(this._start, this._end);
		const topPaddingHeight = this._rowHeight * this._start;
		let bottomPaddingHeight = 0;
		if (totalRows >= pageSize) {
			bottomPaddingHeight =
				totalRows * this._rowHeight -
				topPaddingHeight -
				(this._end - this._start) * this._rowHeight;
		}

		let containerProperties: VNodeProperties = {
			key: 'root',
			classes: [this.theme(css.root), fixedCss.rootFixed],
			role: 'rowgroup',
			onscroll: this._onScroll,
			styles: width
				? { height: `${height}px`, width: `${width}px` }
				: { height: `${height}px` }
		};

		if (this._resetScroll) {
			this._resetScroll = false;
			containerProperties = {
				...containerProperties,
				scrollTop: 0
			};
		}

		return v('div', containerProperties, [
			v('div', { styles: rowWidth ? { width: `${rowWidth}px` } : {} }, [
				v('div', { key: 'top', styles: { height: `${topPaddingHeight}px` } }),
				...rows,
				v('div', {
					key: 'bottom',
					styles: { height: `${bottomPaddingHeight}px` }
				})
			])
		]);
	}
}
