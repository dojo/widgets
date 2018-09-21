const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import Dimensions from '@dojo/framework/widget-core/meta/Dimensions';
import Resize from '@dojo/framework/widget-core/meta/Resize';
import { Store } from '@dojo/framework/stores/Store';
import { OperationType } from '@dojo/framework/stores/state/Patch';
import { Pointer } from '@dojo/framework/stores/state/Pointer';

import Grid from '../../../widgets/Grid';
import * as css from '../../../../theme/grid.m.css';
import * as fixedCss from '../../../styles/grid.m.css';
import { ColumnConfig } from '../../../interfaces';
import { stub } from 'sinon';
import { MockMetaMixin } from '../../../../common/tests/support/test-helpers';
import Header from '../../../widgets/Header';
import Body from '../../../widgets/Body';
import Footer from '../../../widgets/Footer';

const noop: any = () => {};

const columnConfig: ColumnConfig[] = [];

let mockDimensionsGet = stub();
mockDimensionsGet.withArgs('header').returns({ size: { height: 150 } });
mockDimensionsGet.withArgs('footer').returns({ size: { height: 50 } });
const metaDimensionsReturn = {
	get: mockDimensionsGet,
	has: () => false
};
const metaResizeReturn = {
	get: () => {}
};
const mockMeta = stub();
mockMeta.withArgs(Dimensions).returns(metaDimensionsReturn);
mockMeta.withArgs(Resize).returns(metaResizeReturn);

describe('Grid', () => {
	it('should render only the container when no dimensions', () => {
		const h = harness(() =>
			w(Grid, {
				fetcher: noop,
				updater: noop,
				columnConfig,
				storeId: 'id',
				height: 0
			})
		);

		h.expect(() => v('div', { key: 'root', classes: [css.root, fixedCss.rootFixed], role: 'table' }));
	});

	it('should use store from properties when passed', () => {
		const store = new Store();
		const filterableConfig = [{ id: 'id', title: 'id', filterable: true }];
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig: filterableConfig,
				store,
				height: 500
			})
		);

		h.expect(() =>
			v('div', { key: 'root', classes: [css.root, fixedCss.rootFixed], role: 'table' }, [
				v('div', {
					key: 'header',
					scrollLeft: 0,
					classes: [css.header, fixedCss.headerFixed, css.filterGroup],
					row: 'rowgroup'
				}, [
					w(Header, {
						key: 'header-row',
						columnConfig: filterableConfig,
						sorter: noop,
						sort: undefined,
						filter: undefined,
						filterer: noop
					})
				]),
				w(Body, {
					key: 'body',
					pages: {},
					totalRows: undefined,
					pageSize: 100,
					columnConfig: filterableConfig,
					pageChange: noop,
					updater: noop,
					fetcher: noop,
					onScroll: noop,
					height: 300
				}),
				v('div', { key: 'footer' }, [
					w(Footer, {
						key: 'footer-row',
						total: undefined,
						page: 1,
						pageSize: 100
					})
				])
			])
		);

		store.apply(
			[
				{
					op: OperationType.REPLACE,
					path: new Pointer('_grid/data/pages/page-1'),
					value: [{ id: 'id' }]
				},
				{
					op: OperationType.REPLACE,
					path: new Pointer('_grid/meta'),
					value: {
						page: 10,
						sort: {
							columnId: 'id',
							direction: 'asc'
						},
						filter: {
							columnId: 'id',
							value: 'id'
						},
						total: 100
					}
				}
			],
			true
		);

		h.expect(() =>
			v('div', { key: 'root', classes: [css.root, fixedCss.rootFixed], role: 'table' }, [
				v('div', {
					key: 'header',
					scrollLeft: 0,
					classes: [css.header, fixedCss.headerFixed, css.filterGroup],
					row: 'rowgroup'
				}, [
					w(Header, {
						key: 'header-row',
						columnConfig: filterableConfig,
						sorter: noop,
						sort: {
							columnId: 'id',
							direction: 'asc'
						},
						filter: {
							columnId: 'id',
							value: 'id'
						},
						filterer: noop
					})
				]),
				w(Body, {
					key: 'body',
					pages: {
						'page-1': [{ id: 'id' }]
					},
					totalRows: 100,
					pageSize: 100,
					columnConfig: filterableConfig,
					pageChange: noop,
					updater: noop,
					fetcher: noop,
					onScroll: noop,
					height: 300
				}),
				v('div', { key: 'footer' }, [
					w(Footer, {
						key: 'footer-row',
						total: 100,
						page: 10,
						pageSize: 100
					})
				])
			])
		);
	});

	it('should render the grid when the dimension are known', () => {
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig,
				height: 250
			})
		);

		h.expect(() =>
			v('div', { key: 'root', classes: [css.root, fixedCss.rootFixed], role: 'table' }, [
				v('div', {
					key: 'header',
					scrollLeft: 0,
					classes: [css.header, fixedCss.headerFixed, null],
					row: 'rowgroup'
				}, [
					w(Header, {
						key: 'header-row',
						columnConfig,
						sorter: noop,
						sort: undefined,
						filter: undefined,
						filterer: noop
					})
				]),
				w(Body, {
					key: 'body',
					pages: {},
					totalRows: undefined,
					pageSize: 100,
					columnConfig,
					pageChange: noop,
					updater: noop,
					fetcher: noop,
					onScroll: noop,
					height: 50
				}),
				v('div', { key: 'footer' }, [
					w(Footer, {
						key: 'footer-row',
						total: undefined,
						page: 1,
						pageSize: 100
					})
				])
			])
		);
	});

	it('should set the scrollLeft of the header when onScroll is called', () => {
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig,
				height: 500
			})
		);

		h.expect(() =>
			v('div', { key: 'root', classes: [css.root, fixedCss.rootFixed], role: 'table' }, [
				v('div', {
					key: 'header',
					scrollLeft: 0,
					classes: [css.header, fixedCss.headerFixed, null],
					row: 'rowgroup'
				}, [
					w(Header, {
						key: 'header-row',
						columnConfig,
						sorter: noop,
						sort: undefined,
						filter: undefined,
						filterer: noop
					})
				]),
				w(Body, {
					key: 'body',
					pages: {},
					totalRows: undefined,
					pageSize: 100,
					columnConfig,
					pageChange: noop,
					updater: noop,
					fetcher: noop,
					onScroll: noop,
					height: 300
				}),
				v('div', { key: 'footer' }, [
					w(Footer, {
						key: 'footer-row',
						total: undefined,
						page: 1,
						pageSize: 100
					})
				])
			])
		);

		h.trigger('@body', 'onScroll', 10);

		h.expect(() =>
			v('div', { key: 'root', classes: [css.root, fixedCss.rootFixed], role: 'table' }, [
				v('div', {
					key: 'header',
					scrollLeft: 10,
					classes: [css.header, fixedCss.headerFixed, null],
					row: 'rowgroup'
				}, [
					w(Header, {
						key: 'header-row',
						columnConfig,
						sorter: noop,
						sort: undefined,
						filter: undefined,
						filterer: noop
					})
				]),
				w(Body, {
					key: 'body',
					pages: {},
					totalRows: undefined,
					pageSize: 100,
					columnConfig,
					pageChange: noop,
					updater: noop,
					fetcher: noop,
					onScroll: noop,
					height: 300
				}),
				v('div', { key: 'footer' }, [
					w(Footer, {
						key: 'footer-row',
						total: undefined,
						page: 1,
						pageSize: 100
					})
				])
			])
		);
	});
});
