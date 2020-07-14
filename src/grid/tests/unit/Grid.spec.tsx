const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { spy, stub } from 'sinon';

import Dimensions from '@dojo/framework/core/meta/Dimensions';
import Resize from '@dojo/framework/core/meta/Resize';
import { v, w } from '@dojo/framework/core/vdom';
import { Store } from '@dojo/framework/stores/Store';
import { OperationType } from '@dojo/framework/stores/state/Patch';
import { Pointer } from '@dojo/framework/stores/state/Pointer';
import harness from '@dojo/framework/testing/harness/harness';

import { MockMetaMixin } from '../../../common/tests/support/test-helpers';
import * as css from '../../../theme/default/grid.m.css';
import Body from '../../Body';
import Footer from '../../Footer';
import Header from '../../Header';
import PaginatedBody from '../../PaginatedBody';
import PaginatedFooter from '../../PaginatedFooter';
import Grid from '../../index';
import { ColumnConfig } from '../../interfaces';
import * as fixedCss from '../../styles/grid.m.css';

const noop: any = () => {};

const columnConfig: ColumnConfig[] = [];

let mockDimensionsGet = stub();
mockDimensionsGet.withArgs('header').returns({ size: { height: 150, width: 1000 } });
mockDimensionsGet.withArgs('header-wrapper').returns({ size: { height: 150, width: 1000 } });
mockDimensionsGet.withArgs('footer').returns({ size: { height: 50 } });
mockDimensionsGet.withArgs('root').returns({ size: { width: 50 } });
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
	it('should use store from properties when passed', () => {
		const store = new Store();
		const storeSpy = spy(store, 'onChange');
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
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							styles: {},
							classes: [css.header, fixedCss.headerFixed, css.filterGroup],
							row: 'rowgroup',
							scrollLeft: 0
						},
						[
							v('div', { key: 'header-wrapper' }, [
								w(Header, {
									key: 'header-row',
									i18nBundle: undefined,
									columnConfig: filterableConfig,
									sorter: noop,
									sort: undefined,
									filter: undefined,
									filterer: noop,
									classes: undefined,
									theme: undefined,
									filterRenderer: undefined,
									sortRenderer: undefined,
									columnWidths: undefined,
									onColumnResize: noop
								})
							])
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						onScroll: noop,
						pages: {},
						totalRows: undefined,
						pageSize: 100,
						columnConfig: filterableConfig,
						pageChange: noop,
						width: undefined,
						updater: noop,
						fetcher: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						columnWidths: undefined,
						onRowSelect: undefined,
						selectedRows: []
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);

		assert.isTrue(storeSpy.calledWithMatch(store.path('_grid')));

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
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': '100'
				},
				[
					v(
						'div',
						{
							key: 'header',
							classes: [css.header, fixedCss.headerFixed, css.filterGroup],
							styles: {},
							row: 'rowgroup',
							scrollLeft: 0
						},
						[
							v('div', { key: 'header-wrapper' }, [
								w(Header, {
									key: 'header-row',
									i18nBundle: undefined,
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
									filterer: noop,
									classes: undefined,
									theme: undefined,
									filterRenderer: undefined,
									sortRenderer: undefined,
									columnWidths: undefined,
									onColumnResize: noop
								})
							])
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						onScroll: noop,
						pages: {
							'page-1': [{ id: 'id' }]
						},
						totalRows: 100,
						pageSize: 100,
						columnConfig: filterableConfig,
						pageChange: noop,
						width: undefined,
						updater: noop,
						fetcher: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						columnWidths: undefined,
						onRowSelect: undefined,
						selectedRows: undefined
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: 100,
							page: 10,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);
	});

	it('should subscribe to the store id passed when using an external store', () => {
		const store = new Store();
		const storeSpy = spy(store, 'onChange');
		const filterableConfig = [{ id: 'id', title: 'id', filterable: true }];
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig: filterableConfig,
				store,
				storeId: 'test-id',
				height: 500
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							classes: [css.header, fixedCss.headerFixed, css.filterGroup],
							styles: {},
							row: 'rowgroup',
							scrollLeft: 0
						},
						[
							v('div', { key: 'header-wrapper' }, [
								w(Header, {
									key: 'header-row',
									i18nBundle: undefined,
									columnConfig: filterableConfig,
									sorter: noop,
									sort: undefined,
									filter: undefined,
									filterer: noop,
									classes: undefined,
									theme: undefined,
									filterRenderer: undefined,
									sortRenderer: undefined,
									columnWidths: undefined,
									onColumnResize: noop
								})
							])
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						onScroll: noop,
						pages: {},
						totalRows: undefined,
						pageSize: 100,
						columnConfig: filterableConfig,
						pageChange: noop,
						width: undefined,
						updater: noop,
						fetcher: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						columnWidths: undefined,
						onRowSelect: undefined,
						selectedRows: []
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);

		assert.isTrue(storeSpy.calledWithMatch(store.path('test-id')));
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
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							classes: [css.header, fixedCss.headerFixed, null],
							styles: {},
							row: 'rowgroup',
							scrollLeft: 0
						},
						[
							v('div', { key: 'header-wrapper' }, [
								w(Header, {
									key: 'header-row',
									i18nBundle: undefined,
									columnConfig,
									sorter: noop,
									sort: undefined,
									filter: undefined,
									filterer: noop,
									classes: undefined,
									theme: undefined,
									filterRenderer: undefined,
									sortRenderer: undefined,
									columnWidths: undefined,
									onColumnResize: noop
								})
							])
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						onScroll: noop,
						pages: {},
						totalRows: undefined,
						pageSize: 100,
						columnConfig,
						pageChange: noop,
						width: undefined,
						updater: noop,
						fetcher: noop,
						height: 50,
						classes: undefined,
						theme: undefined,
						columnWidths: undefined,
						onRowSelect: undefined,
						selectedRows: []
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
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
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							scrollLeft: 0,
							styles: {},
							classes: [css.header, fixedCss.headerFixed, null],
							row: 'rowgroup'
						},
						[
							v(
								'div',
								{
									key: 'header-wrapper'
								},
								[
									w(Header, {
										key: 'header-row',
										i18nBundle: undefined,
										columnConfig,
										columnWidths: undefined,
										sorter: noop,
										sort: undefined,
										filter: undefined,
										onColumnResize: noop,
										filterer: noop,
										classes: undefined,
										theme: undefined,
										filterRenderer: undefined,
										sortRenderer: undefined
									})
								]
							)
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						pages: {},
						totalRows: undefined,
						pageSize: 100,
						columnConfig,
						columnWidths: undefined,
						pageChange: noop,
						updater: noop,
						fetcher: noop,
						onScroll: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						width: undefined,
						onRowSelect: undefined,
						selectedRows: []
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);

		h.trigger('@body', 'onScroll', 10);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							scrollLeft: 10,
							styles: {},
							classes: [css.header, fixedCss.headerFixed, null],
							row: 'rowgroup'
						},
						[
							v(
								'div',
								{
									key: 'header-wrapper'
								},
								[
									w(Header, {
										key: 'header-row',
										i18nBundle: undefined,
										columnConfig,
										columnWidths: undefined,
										sorter: noop,
										sort: undefined,
										onColumnResize: noop,
										filter: undefined,
										filterer: noop,
										classes: undefined,
										theme: undefined,
										filterRenderer: undefined,
										sortRenderer: undefined
									})
								]
							)
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						pages: {},
						totalRows: undefined,
						pageSize: 100,
						columnConfig,
						columnWidths: undefined,
						pageChange: noop,
						updater: noop,
						fetcher: noop,
						onScroll: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						width: undefined,
						onRowSelect: undefined,
						selectedRows: []
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);
	});

	it('should set pass widths when any of the columns are resizable', () => {
		const columnConfig = [
			{
				id: 'id',
				title: 'Id',
				resizable: true
			},
			{
				id: 'name',
				title: 'Name',
				resizable: true
			}
		];
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig,
				height: 500
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							scrollLeft: 0,
							styles: { width: '1000px' },
							classes: [css.header, fixedCss.headerFixed, null],
							row: 'rowgroup'
						},
						[
							v(
								'div',
								{
									key: 'header-wrapper'
								},
								[
									w(Header, {
										key: 'header-row',
										i18nBundle: undefined,
										columnConfig,
										columnWidths: {
											id: 500,
											name: 500
										},
										sorter: noop,
										sort: undefined,
										filter: undefined,
										onColumnResize: noop,
										filterer: noop,
										classes: undefined,
										theme: undefined,
										filterRenderer: undefined,
										sortRenderer: undefined
									})
								]
							)
						]
					),
					w(Body, {
						key: 'body',
						i18nBundle: undefined,
						pages: {},
						totalRows: undefined,
						pageSize: 100,
						columnConfig,
						columnWidths: {
							id: 500,
							name: 500
						},
						pageChange: noop,
						updater: noop,
						fetcher: noop,
						onScroll: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						width: 1000,
						onRowSelect: undefined,
						selectedRows: []
					}),
					v('div', { key: 'footer' }, [
						w(Footer, {
							key: 'footer-row',
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);
	});

	it('should pass row selection for grid and selected rows', () => {
		const columnConfig = [
			{
				id: 'id',
				title: 'Id',
				resizable: true
			},
			{
				id: 'name',
				title: 'Name',
				resizable: true
			}
		];
		const store = new Store();
		store.apply(
			[
				{
					op: OperationType.REPLACE,
					path: new Pointer('_grid/meta'),
					value: {
						page: 1,
						selection: [1]
					}
				}
			],
			true
		);

		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				store,
				fetcher: noop,
				updater: noop,
				columnConfig,
				height: 500,
				onRowSelect: noop,
				pagination: true
			})
		);

		h.expect(() =>
			v(
				'div',
				{
					key: 'root',
					classes: [undefined, css.root, fixedCss.rootFixed],
					role: 'table',
					'aria-rowcount': undefined
				},
				[
					v(
						'div',
						{
							key: 'header',
							scrollLeft: 0,
							styles: { width: '1000px' },
							classes: [css.header, fixedCss.headerFixed, null],
							row: 'rowgroup'
						},
						[
							v(
								'div',
								{
									key: 'header-wrapper'
								},
								[
									w(Header, {
										key: 'header-row',
										i18nBundle: undefined,
										columnConfig,
										columnWidths: {
											id: 500,
											name: 500
										},
										sorter: noop,
										sort: undefined,
										filter: undefined,
										onColumnResize: noop,
										filterer: noop,
										classes: undefined,
										theme: undefined,
										filterRenderer: undefined,
										sortRenderer: undefined
									})
								]
							)
						]
					),
					w(PaginatedBody, {
						key: 'paginated-body',
						i18nBundle: undefined,
						pages: {},
						pageSize: 100,
						columnConfig,
						columnWidths: {
							id: 500,
							name: 500
						},
						updater: noop,
						fetcher: noop,
						onScroll: noop,
						height: 300,
						classes: undefined,
						theme: undefined,
						width: 1000,
						onRowSelect: noop,
						selectedRows: [1],
						pageNumber: 1
					}),
					v('div', { key: 'footer' }, [
						w(PaginatedFooter, {
							onPageChange: noop,
							i18nBundle: undefined,
							total: undefined,
							page: 1,
							pageSize: 100,
							classes: undefined,
							theme: undefined
						})
					])
				]
			)
		);
	});
});
