import './utils';

import WidgetBase from '@dojo/framework/core/WidgetBase';
import diffProperty from '@dojo/framework/core/decorators/diffProperty';
import { reference } from '@dojo/framework/core/diff';
import { DNode } from '@dojo/framework/core/interfaces';
import Dimensions from '@dojo/framework/core/meta/Dimensions';
import Resize from '@dojo/framework/core/meta/Resize';
import I18nMixin, { I18nProperties } from '@dojo/framework/core/mixins/I18n';
import ThemedMixin, { ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v, w } from '@dojo/framework/core/vdom';
import { Store } from '@dojo/framework/stores/Store';

import * as css from '../theme/default/grid.m.css';
import Body from './Body';
import Footer from './Footer';
import Header, { FilterRenderer, SortRenderer } from './Header';
import PaginatedBody from './PaginatedBody';
import PaginatedFooter from './PaginatedFooter';
import { ColumnConfig, Fetcher, GridState, Updater } from './interfaces';
import {
	clearSelectionProcess,
	fetcherProcess,
	filterProcess,
	pageChangeProcess,
	selectionProcess,
	sortProcess,
	updaterProcess
} from './processes';
import * as fixedCss from './styles/grid.m.css';

const defaultGridMeta = {
	page: 1,
	total: undefined,
	sort: undefined,
	filter: undefined,
	isSorting: false,
	editedRow: undefined,
	selection: []
};

export interface CustomRenderers {
	sortRenderer?: SortRenderer;
	filterRenderer?: FilterRenderer;
}

export interface GridProperties<S> extends I18nProperties, ThemedProperties {
	/** The full configuration for the grid columns */
	columnConfig: ColumnConfig[];
	/** function that returns results for the page reflected */
	fetcher: Fetcher<S>;
	/** gird height in px */
	height: number;
	/** function that updates an item from a edit made in the grid */
	updater?: Updater<S>;
	/** options store, if no store is passed each grid will factory their own grid */
	store?: Store<S>;
	/** the path to store the grid data in */
	storeId?: string;
	/** set of custom renderers for sorting or filtering */
	customRenderers?: CustomRenderers;
	/** when set uses traditional pagination */
	pagination?: boolean;
	/** handler for row selection */
	onRowSelect?: (rowData: S[]) => void;
}

const MIN_COLUMN_WIDTH = 100;

@theme(css)
export default class Grid<S> extends I18nMixin(ThemedMixin(WidgetBase))<GridProperties<S>> {
	private _store = new Store<GridState<S>>();
	private _handle: any;
	private _scrollLeft = 0;
	private _pageSize = 100;
	private _columnWidths: { [index: string]: number } | undefined;
	private _gridWidth = 0;

	constructor() {
		super();
		this._handle = this._store.onChange(this._store.path('_grid'), this.invalidate.bind(this));
	}

	@diffProperty('store', reference)
	protected onStoreProperty(previous: any, current: any) {
		const { storeId = '_grid' } = current;
		this._handle.remove();
		this._store = current.store;
		this._handle = this._store.onChange(this._store.path(storeId), () => {
			this.invalidate();
		});
	}

	private _getProperties() {
		const { storeId = '_grid' } = this.properties;
		return { ...this.properties, storeId };
	}

	private _getBodyDimensions() {
		const { height } = this.properties;
		const headerWrapper = this.meta(Dimensions).get('header-wrapper');
		const {
			size: { height: headerHeight, width: bodyWidth }
		} = this.meta(Dimensions).get('header');
		const {
			size: { height: footerHeight }
		} = this.meta(Dimensions).get('footer');

		return {
			headerWidth: headerWrapper.size.width,
			bodyHeight: footerHeight && footerHeight ? height - headerHeight - footerHeight : 0,
			bodyWidth
		};
	}

	private _onColumnResize(index: number, value: number) {
		const { columnConfig } = this.properties;
		if (!this._columnWidths) {
			return;
		}
		const currentColumnWidth = this._columnWidths[columnConfig[index].id];
		if (currentColumnWidth <= MIN_COLUMN_WIDTH && value < 0) {
			return;
		}

		if (currentColumnWidth + value <= MIN_COLUMN_WIDTH) {
			value = value - (currentColumnWidth + value - MIN_COLUMN_WIDTH);
		}

		this._columnWidths = {
			...this._columnWidths,
			[columnConfig[index].id]: currentColumnWidth + value
		};
		this.invalidate();
	}

	private _fetcher(page: number, pageSize: number) {
		const { storeId, fetcher } = this._getProperties();
		fetcherProcess(this._store)({ id: storeId, fetcher, page, pageSize });
	}

	private _sorter(columnId: string, direction: 'asc' | 'desc') {
		const { storeId, fetcher, onRowSelect } = this._getProperties();
		if (onRowSelect) {
			const selectedIndexes =
				this._store.get(this._store.path(storeId, 'meta', 'selection')) || [];
			selectedIndexes.length && onRowSelect([]);
		}
		sortProcess(this._store)({ id: storeId, fetcher, columnId, direction });
	}

	private _filterer(columnId: string, value: any) {
		const { storeId, fetcher, onRowSelect } = this._getProperties();
		if (onRowSelect) {
			const selectedIndexes =
				this._store.get(this._store.path(storeId, 'meta', 'selection')) || [];
			selectedIndexes.length && onRowSelect([]);
		}
		filterProcess(this._store)({ id: storeId, fetcher, filterOptions: { columnId, value } });
	}

	private _updater(page: number, rowNumber: number, columnId: string, value: string) {
		const { storeId, updater } = this._getProperties();
		updaterProcess(this._store)({ id: storeId, page, columnId, rowNumber, value, updater });
	}

	private _pageChange(page: number) {
		const { pagination, storeId } = this._getProperties();
		if (pagination) {
			clearSelectionProcess(this._store)({ id: storeId });
		}
		pageChangeProcess(this._store)({ id: storeId, page });
	}

	private _selection(index: number, type: any) {
		const { storeId, onRowSelect } = this._getProperties();
		selectionProcess(this._store)({ id: storeId, index, type });
		const selectedIndexes =
			this._store.get(this._store.path(storeId, 'meta', 'selection')) || [];
		const items = [];
		const data = this._store.get(this._store.path(storeId, 'data', 'pages'));
		const pageNumber = this._store.get(this._store.path(storeId, 'meta', 'page'));

		for (let i = 0; i < selectedIndexes.length; i++) {
			const selectedIndex = selectedIndexes[i];
			const offset = Math.floor(selectedIndex / this._pageSize) + 1;
			const itemIndex = selectedIndex - (offset - 1) * this._pageSize;
			if (data[`page-${pageNumber}`]) {
				items.push(data[`page-${pageNumber}`][itemIndex]);
			}
		}
		onRowSelect && onRowSelect(items);
	}

	private _onScroll(value: number) {
		this._scrollLeft = value;
		this.invalidate();
	}

	protected render(): DNode {
		const {
			i18nBundle,
			columnConfig,
			storeId,
			theme,
			classes,
			pagination = false,
			customRenderers = {},
			onRowSelect
		} = this._getProperties();
		const { sortRenderer, filterRenderer } = customRenderers;

		if (!columnConfig || !this.properties.fetcher) {
			return null;
		}

		const meta = this._store.get(this._store.path(storeId, 'meta')) || defaultGridMeta;
		const pages = this._store.get(this._store.path(storeId, 'data', 'pages')) || {};
		const hasFilters = columnConfig.some((config) => !!config.filterable);
		const hasResizableColumns = columnConfig.some((config) => !!config.resizable);
		const { bodyHeight, bodyWidth, headerWidth } = this._getBodyDimensions();
		this.meta(Resize).get('root');

		if (bodyWidth && headerWidth && hasResizableColumns && !this._columnWidths) {
			const width = headerWidth / columnConfig.length;
			this._columnWidths = columnConfig.reduce(
				(sizes, { id }) => {
					sizes[id] = Math.max(MIN_COLUMN_WIDTH, width);
					return sizes;
				},
				{} as any
			);
			this._gridWidth = Math.max(bodyWidth, MIN_COLUMN_WIDTH * columnConfig.length);
		}

		return v(
			'div',
			{
				key: 'root',
				classes: [this.variant(), this.theme(css.root), fixedCss.rootFixed],
				role: 'table',
				'aria-rowcount': meta.total ? `${meta.total}` : undefined
			},
			[
				v(
					'div',
					{
						key: 'header',
						scrollLeft: this._scrollLeft,
						styles:
							hasResizableColumns && this._gridWidth
								? {
										width: `${this._gridWidth}px`
								  }
								: {},
						classes: [
							this.theme(css.header),
							fixedCss.headerFixed,
							hasFilters ? this.theme(css.filterGroup) : null
						],
						row: 'rowgroup'
					},
					[
						v('div', { key: 'header-wrapper' }, [
							w(Header, {
								key: 'header-row',
								i18nBundle,
								theme,
								columnWidths: this._columnWidths,
								classes,
								columnConfig,
								sorter: this._sorter,
								sort: meta.sort,
								filter: meta.filter,
								filterer: this._filterer,
								sortRenderer,
								filterRenderer,
								onColumnResize: this._onColumnResize
							})
						])
					]
				),
				bodyHeight
					? pagination
						? w(PaginatedBody, {
								key: 'paginated-body',
								i18nBundle,
								theme,
								classes,
								pages,
								columnWidths: this._columnWidths,
								pageNumber: meta.page,
								pageSize: this._pageSize,
								onScroll: this._onScroll,
								columnConfig,
								fetcher: this._fetcher,
								updater: this._updater,
								height: bodyHeight,
								width: hasResizableColumns ? this._gridWidth : undefined,
								onRowSelect: onRowSelect ? this._selection : undefined,
								selectedRows: meta.selection
						  })
						: w(Body, {
								key: 'body',
								i18nBundle,
								theme,
								classes,
								pages,
								columnWidths: this._columnWidths,
								totalRows: meta.total,
								pageSize: this._pageSize,
								columnConfig,
								fetcher: this._fetcher,
								pageChange: this._pageChange,
								updater: this._updater,
								onScroll: this._onScroll,
								height: bodyHeight,
								width: hasResizableColumns ? this._gridWidth : undefined,
								onRowSelect: onRowSelect ? this._selection : undefined,
								selectedRows: meta.selection
						  })
					: null,
				v('div', { key: 'footer' }, [
					pagination
						? w(PaginatedFooter, {
								i18nBundle,
								theme,
								classes,
								total: meta.total,
								page: meta.page,
								pageSize: this._pageSize,
								onPageChange: (page: number) => {
									this._pageChange(page);
								}
						  })
						: w(Footer, {
								key: 'footer-row',
								i18nBundle,
								theme,
								classes,
								total: meta.total,
								page: meta.page,
								pageSize: this._pageSize
						  })
				])
			]
		);
	}
}
