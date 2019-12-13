const { describe, it, beforeEach } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { Store } from '@dojo/framework/stores/Store';
import { stub } from 'sinon';
import { OperationType } from '@dojo/framework/stores/state/Patch';
import { Pointer } from '@dojo/framework/stores/state/Pointer';
import {
	pageChangeProcess,
	fetcherProcess,
	sortProcess,
	filterProcess,
	updaterProcess,
	selectionProcess,
	clearSelectionProcess
} from '../../processes';

let store: Store;

describe('Grid Processes', () => {
	beforeEach(() => {
		store = new Store();
	});

	describe('Page Change Process', () => {
		it('should change the page', () => {
			pageChangeProcess(store)({ id: 'grid', page: 2 });
			const page = store.get(store.path('grid', 'meta', 'page'));
			assert.strictEqual(page, 2);
		});

		it('Should not fail if the page is already set', () => {
			pageChangeProcess(store)({ id: 'grid', page: 2 });
			let page = store.get(store.path('grid', 'meta', 'page'));
			assert.strictEqual(page, 2);
			pageChangeProcess(store)({ id: 'grid', page: 2 });
			page = store.get(store.path('grid', 'meta', 'page'));
			assert.strictEqual(page, 2);
		});
	});

	describe('Fetcher Process', () => {
		it('fetcher should update the page and meta data for request', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			await fetcherProcess(store)({
				id: 'grid',
				page: 2,
				fetcher: fetcherStub,
				pageSize: 100
			});
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-2': [{ id: '1' }] } });
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, { fetchedPages: [2], page: 2, total: 10000, pageSize: 100 });
		});

		it('Should throw an error if the page has already been fetched', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			await fetcherProcess(store)({
				id: 'grid',
				page: 2,
				fetcher: fetcherStub,
				pageSize: 100
			});
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-2': [{ id: '1' }] } });
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, { fetchedPages: [2], page: 2, total: 10000, pageSize: 100 });
			return fetcherProcess(store)({
				id: 'grid',
				page: 2,
				fetcher: fetcherStub,
				pageSize: 100
			}).then((result) => {
				assert.isOk(result.error);
				assert.strictEqual(
					(result as any).error.error.message,
					'The page has already been requested'
				);
			});
		});

		it('Should throw an error if the grid is sorting', async () => {
			const fetcherStub = stub();
			store.apply([
				{
					op: OperationType.REPLACE,
					path: new Pointer(['grid', 'meta', 'isSorting']),
					value: true
				}
			]);
			return fetcherProcess(store)({
				id: 'grid',
				page: 2,
				fetcher: fetcherStub,
				pageSize: 100
			}).then((result) => {
				assert.isOk(result.error);
				assert.strictEqual(
					(result as any).error.error.message,
					'The grid is being sorted or filtered'
				);
			});
		});
	});

	describe('Filterer Process', () => {
		it('should filter', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			store.apply([
				{
					op: OperationType.REPLACE,
					path: new Pointer(['grid', 'meta', 'page']),
					value: 10
				}
			]);
			await filterProcess(store)({
				filterOptions: { columnId: 'id', value: 'filter' },
				id: 'grid',
				fetcher: fetcherStub
			});
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-1': [{ id: '1' }] } });
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, {
				currentFilter: {
					columnId: 'id',
					value: 'filter'
				},
				page: 1,
				filter: { id: 'filter' },
				fetchedPages: [1],
				isSorting: false,
				total: 10000
			});
		});
	});

	describe('Sort Process', () => {
		it('should sort for first page', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			store.apply([
				{ op: OperationType.REPLACE, path: new Pointer(['grid', 'meta', 'page']), value: 1 }
			]);
			await sortProcess(store)({
				columnId: 'id',
				direction: 'asc',
				id: 'grid',
				fetcher: fetcherStub
			});
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-1': [{ id: '1' }] } });
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, {
				page: 1,
				sort: { columnId: 'id', direction: 'asc' },
				fetchedPages: [1],
				isSorting: false,
				total: 10000
			});
		});

		it('should sort', async () => {
			const fetcherStub = stub();
			fetcherStub.returns({
				data: [{ id: '1' }],
				meta: {
					total: 10000
				}
			});
			store.apply([
				{
					op: OperationType.REPLACE,
					path: new Pointer(['grid', 'meta', 'page']),
					value: 10
				}
			]);
			await sortProcess(store)({
				columnId: 'id',
				direction: 'asc',
				id: 'grid',
				fetcher: fetcherStub
			});
			const pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, {
				pages: { 'page-9': [{ id: '1' }], 'page-10': [{ id: '1' }] }
			});
			const meta = store.get(store.path('grid', 'meta'));
			assert.deepEqual(meta, {
				page: 10,
				sort: { columnId: 'id', direction: 'asc' },
				fetchedPages: [10, 9],
				isSorting: false,
				total: 10000
			});
		});
	});

	describe('Updater Process', () => {
		it('Should update item', async () => {
			const updaterStub = stub();
			store.apply([
				{
					op: OperationType.REPLACE,
					path: new Pointer(['grid', 'data', 'pages', 'page-1']),
					value: [{ id: 'A', name: 'bill' }]
				}
			]);
			let pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-1': [{ id: 'A', name: 'bill' }] } });
			await updaterProcess(store)({
				updater: updaterStub,
				columnId: 'name',
				id: 'grid',
				value: 'foo',
				page: 1,
				rowNumber: 0
			});
			pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-1': [{ id: 'A', name: 'foo' }] } });
		});

		it('Should revert item on error', async () => {
			const updaterStub = stub();
			updaterStub.throws();
			store.apply([
				{
					op: OperationType.REPLACE,
					path: new Pointer(['grid', 'data', 'pages', 'page-1']),
					value: [{ id: 'A', name: 'bill' }]
				}
			]);
			let pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-1': [{ id: 'A', name: 'bill' }] } });
			await updaterProcess(store)({
				updater: updaterStub,
				columnId: 'name',
				id: 'grid',
				value: 'foo',
				page: 1,
				rowNumber: 0
			});
			pages = store.get(store.path('grid', 'data'));
			assert.deepEqual(pages, { pages: { 'page-1': [{ id: 'A', name: 'bill' }] } });
		});
	});

	describe('row selection process', () => {
		it('should select row in single mode', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'single', index: 1, id: 'grid' });
		});

		it('should deselect row in single mode when selected', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'single', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1]);
			selectionProcess(store)({ type: 'single', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, []);
		});

		it('should select row in multi mode', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'multi', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1]);
		});

		it('should select additional row in multi mode', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'multi', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1]);
			selectionProcess(store)({ type: 'multi', index: 2, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1, 2]);
		});

		it('should deselect row in multi mode when selected', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'multi', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1]);
			selectionProcess(store)({ type: 'multi', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, []);
		});

		it('should select row in single mode when multiple rows are selected', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'multi', index: 1, id: 'grid' });
			selectionProcess(store)({ type: 'multi', index: 2, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1, 2]);
			selectionProcess(store)({ type: 'single', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1]);
		});

		it('should clear selection', () => {
			let selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
			selectionProcess(store)({ type: 'single', index: 1, id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, [1]);
			clearSelectionProcess(store)({ id: 'grid' });
			selection = store.get(store.path('grid', 'meta', 'selection'));
			assert.deepEqual(selection, undefined);
		});
	});
});
