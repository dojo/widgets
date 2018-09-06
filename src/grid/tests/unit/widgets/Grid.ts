const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness';
import { v, w } from '@dojo/framework/widget-core/d';
import Dimensions from '@dojo/framework/widget-core/meta/Dimensions';
import { Store } from '@dojo/framework/stores/Store';
import { OperationType } from '@dojo/framework/stores/state/Patch';
import { Pointer } from '@dojo/framework/stores/state/Pointer';

import Grid from '../../../widgets/Grid';
import * as css from '../../../widgets/styles/Grid.m.css';
import { ColumnConfig } from '../../../interfaces';
import { stub } from 'sinon';
import { MockMetaMixin } from '../../../../common/tests/support/test-helpers';
import Header from '../../../widgets/Header';
import Body from '../../../widgets/Body';
import Footer from '../../../widgets/Footer';

const noop: any = () => {};

const columnConfig: ColumnConfig[] = [];
let mockDimensionsGet = stub();
const mockMeta = stub();
let dimensions = {
	size: {
		height: 500
	}
};
mockDimensionsGet.withArgs('root').returns(dimensions);
const metaReturn = {
	get: mockDimensionsGet,
	has: () => false
};
mockMeta.withArgs(Dimensions).returns(metaReturn);

describe('Grid', () => {
	it('should render only the container when no dimensions', () => {
		const h = harness(() =>
			w(Grid, {
				fetcher: noop,
				updater: noop,
				columnConfig,
				storeId: 'id'
			})
		);

		h.expect(() => v('div', { key: 'root', classes: css.root, role: 'table' }));
	});

	it('should use store from properties when passed', () => {
		const store = new Store();
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig,
				store
			})
		);

		h.expect(() =>
			v('div', { key: 'root', classes: css.root, role: 'table' }, [
				w(Header, {
					key: 'header',
					columnConfig,
					sorter: noop,
					sort: undefined,
					filter: undefined,
					filterer: noop,
					scrollLeft: 0
				}),
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
					height: 500
				}),
				w(Footer, {
					key: 'footer',
					total: undefined,
					page: 1,
					pageSize: 100
				})
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
			v('div', { key: 'root', classes: css.root, role: 'table' }, [
				w(Header, {
					key: 'header',
					columnConfig,
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
					scrollLeft: 0
				}),
				w(Body, {
					key: 'body',
					pages: {
						'page-1': [{ id: 'id' }]
					},
					totalRows: 100,
					pageSize: 100,
					columnConfig,
					pageChange: noop,
					updater: noop,
					fetcher: noop,
					onScroll: noop,
					height: 500
				}),
				w(Footer, {
					key: 'footer',
					total: 100,
					page: 10,
					pageSize: 100
				})
			])
		);
	});

	it('should render the grid when the dimension are known', () => {
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig
			})
		);

		h.expect(() =>
			v('div', { key: 'root', classes: css.root, role: 'table' }, [
				w(Header, {
					key: 'header',
					columnConfig,
					sorter: noop,
					sort: undefined,
					filter: undefined,
					filterer: noop,
					scrollLeft: 0
				}),
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
					height: 500
				}),
				w(Footer, {
					key: 'footer',
					total: undefined,
					page: 1,
					pageSize: 100
				})
			])
		);
	});

	it('should set the scrollLeft of the header when onScroll is called', () => {
		const h = harness(() =>
			w(MockMetaMixin(Grid, mockMeta), {
				fetcher: noop,
				updater: noop,
				columnConfig
			})
		);

		h.expect(() =>
			v('div', { key: 'root', classes: css.root, role: 'table' }, [
				w(Header, {
					key: 'header',
					columnConfig,
					sorter: noop,
					sort: undefined,
					filter: undefined,
					filterer: noop,
					scrollLeft: 0
				}),
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
					height: 500
				}),
				w(Footer, {
					key: 'footer',
					total: undefined,
					page: 1,
					pageSize: 100
				})
			])
		);

		h.trigger('@body', 'onScroll', 10);

		h.expect(() =>
			v('div', { key: 'root', classes: css.root, role: 'table' }, [
				w(Header, {
					key: 'header',
					columnConfig,
					sorter: noop,
					sort: undefined,
					filter: undefined,
					filterer: noop,
					scrollLeft: 10
				}),
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
					height: 500
				}),
				w(Footer, {
					key: 'footer',
					total: undefined,
					page: 1,
					pageSize: 100
				})
			])
		);
	});
});
