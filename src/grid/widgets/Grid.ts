import WidgetBase from '@dojo/framework/widget-core/WidgetBase';
import { v, w } from '@dojo/framework/widget-core/d';
import ThemedMixin, { theme } from '@dojo/framework/widget-core/mixins/Themed';
import diffProperty from '@dojo/framework/widget-core/decorators/diffProperty';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { reference } from '@dojo/framework/widget-core/diff';
import { Store } from '@dojo/framework/stores/Store';
import Dimensions from '@dojo/framework/widget-core/meta/Dimensions';
import Resize from '@dojo/framework/widget-core/meta/Resize';

import { Fetcher, ColumnConfig, GridState, Updater } from './../interfaces';
import { fetcherProcess, pageChangeProcess, sortProcess, filterProcess, updaterProcess } from './../processes';

import Header from './Header';
import Body from './Body';
import Footer from './Footer';
import * as css from './styles/Grid.m.css';
import customElement from '@dojo/framework/widget-core/decorators/customElement';

const defaultGridMeta = {
	page: 1,
	total: undefined,
	sort: undefined,
	filter: undefined,
	isSorting: false,
	editedRow: undefined
};

export interface GridProperties<S> {
	columnConfig: ColumnConfig[];
	fetcher: Fetcher<S>;
	height: number;
	updater?: Updater<S>;
	store?: Store<S>;
	storeId?: string;
}

@theme(css)
@customElement<GridProperties<any>>({
	tag: 'dojo-grid',
	properties: [
		'fetcher',
		'updater',
		'columnConfig',
		'store'
	],
	attributes: [ 'storeId' ]
})
export default class Grid<S> extends ThemedMixin(WidgetBase)<GridProperties<S>> {
	private _store = new Store<GridState<S>>();
	private _handle: any;
	private _scrollLeft = 0;
	private _pageSize = 100;

	constructor() {
		super();
		this._handle = this._store.onChange(this._store.path('_grid'), this.invalidate.bind(this));
	}

	@diffProperty('store', reference)
	protected onStoreProperty(previous: any, current: any) {
		this._handle.remove();
		this._store = current.store;
		this._handle = this._store.onChange(this._store.path('_grid'), () => {
			this.invalidate();
		});
	}

	private _getProperties() {
		const { storeId = '_grid' } = this.properties;
		return { ...this.properties, storeId };
	}

	private _getBodyHeight(): number {
		const { height } = this.properties;
		const headerHeight = this.meta(Dimensions).get('header');
		const footerHeight = this.meta(Dimensions).get('footer');
		return height - headerHeight.size.height - footerHeight.size.height;
	}

	private _fetcher(page: number, pageSize: number) {
		const { storeId, fetcher } = this._getProperties();
		fetcherProcess(this._store)({ id: storeId, fetcher, page, pageSize });
	}

	private _sorter(columnId: string, direction: 'asc' | 'desc') {
		const { storeId, fetcher } = this._getProperties();
		sortProcess(this._store)({ id: storeId, fetcher, columnId, direction });
	}

	private _filterer(columnId: string, value: any) {
		const { storeId, fetcher } = this._getProperties();
		filterProcess(this._store)({ id: storeId, fetcher, columnId, value });
	}

	private _updater(page: number, rowNumber: number, columnId: string, value: string) {
		const { storeId, updater } = this._getProperties();
		updaterProcess(this._store)({ id: storeId, page, columnId, rowNumber, value, updater });
	}

	private _pageChange(page: number) {
		const { storeId } = this._getProperties();
		pageChangeProcess(this._store)({ id: storeId, page });
	}

	private _onScroll(value: number) {
		this._scrollLeft = value;
		this.invalidate();
	}

	protected render(): DNode {
		const { columnConfig, storeId } = this._getProperties();

		if (!columnConfig || !this.properties.fetcher) {
			return null;
		}

		const meta = this._store.get(this._store.path(storeId, 'meta')) || defaultGridMeta;
		const pages = this._store.get(this._store.path(storeId, 'data', 'pages')) || {};
		const hasFilters = columnConfig.some((config) => !!config.filterable);
		const containerDimensions = this.meta(Dimensions).get('root');
		const bodyHeight = this._getBodyHeight();
		this.meta(Resize).get('root');

		if (bodyHeight <= 0) {
			return v('div', { key: 'root', classes: css.root, role: 'table' });
		}

		return v('div', { key: 'root', classes: css.root, role: 'table' }, [
			v('div', {
				key: 'header',
				scrollLeft: this._scrollLeft,
				classes: [css.header, hasFilters ? css.filterGroup : null],
				row: 'rowgroup'
			}, [
				w(Header, {
					key: 'header-row',
					columnConfig,
					sorter: this._sorter,
					sort: meta.sort,
					filter: meta.filter,
					filterer: this._filterer
				})
			]),
			w(Body, {
				key: 'body',
				pages,
				totalRows: meta.total,
				pageSize: this._pageSize,
				columnConfig,
				fetcher: this._fetcher,
				pageChange: this._pageChange,
				updater: this._updater,
				onScroll: this._onScroll,
				height: bodyHeight
			}),
			v('div', { key: 'footer' }, [
				w(Footer, {
					key: 'footer-row',
					total: meta.total,
					page: meta.page,
					pageSize: this._pageSize
				})
			])
		]);
	}
}
