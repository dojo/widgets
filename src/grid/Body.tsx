import global from '@dojo/framework/shim/global';
import WidgetBase from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import ThemedMixin, { theme } from '@dojo/framework/core/mixins/Themed';
import { DNode, VNodeProperties } from '@dojo/framework/core/interfaces';
import renderer from '@dojo/framework/core/vdom';

import { GridPages, ColumnConfig } from './interfaces';
import PlaceholderRow from './PlaceholderRow';
import Row from './Row';

import * as fixedCss from './styles/body.m.css';
import * as css from '../theme/default/grid-body.m.css';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import { auto, reference } from '@dojo/framework/core/diff';

export interface BodyProperties<S> {
	totalRows?: number;
	pageSize: number;
	pages: GridPages<S>;
	height: number;
	columnConfig: ColumnConfig[];
	placeholderRowRenderer?: (index: number) => DNode;
	fetcher: (page: number, pageSize: number) => void;
	updater: (page: number, rowNumber: number, columnId: string, value: string) => void;
	pageChange: (page: number) => void;
	onScroll: (value: number) => void;
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

const defaultPlaceholderRowRenderer = (index: number) => {
	return w(PlaceholderRow, { key: index });
};

@theme(css)
@diffProperty('pages', reference)
export default class Body<S> extends ThemedMixin(WidgetBase)<BodyProperties<S>> {
	private _rowHeight!: number;
	private _rowsInView!: number;
	private _renderPageSize!: number;
	private _start = 0;
	private _end = 100;
	private _resetScroll = false;

	private _updater(rowNumber: number, columnId: string, value: any) {
		const page = Math.max(Math.ceil(rowNumber / this.properties.pageSize), 1);
		const pageItemNumber = rowNumber - (page - 1) * this.properties.pageSize;
		this.properties.updater(page, pageItemNumber, columnId, value);
	}

	private _onScroll(event: UIEvent) {
		const { totalRows = 0 } = this.properties;
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
		this.properties.onScroll(scrollLeft);
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
			pageSize,
			fetcher,
			pages,
			columnConfig,
			placeholderRowRenderer = defaultPlaceholderRowRenderer,
			pageChange,
			totalRows,
			theme,
			classes
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
						theme,
						classes,
						item,
						columnConfig,
						updater: this._updater
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
			placeholderRowRenderer = defaultPlaceholderRowRenderer,
			totalRows = 0,
			pageSize,
			height
		} = this.properties;

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
			styles: { height: `${height}px` }
		};

		if (this._resetScroll) {
			this._resetScroll = false;
			containerProperties = {
				...containerProperties,
				scrollTop: 0
			};
		}

		return v('div', containerProperties, [
			v('div', { key: 'top', styles: { height: `${topPaddingHeight}px` } }),
			...rows,
			v('div', {
				key: 'bottom',
				styles: { height: `${bottomPaddingHeight}px` }
			})
		]);
	}
}
