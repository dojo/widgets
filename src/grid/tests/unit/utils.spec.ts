const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { sorter, filterer, createFetcherResult, createFetcher, createUpdater } from '../../utils';

describe('Grid Utils', () => {
	it('Should only clone data when no sort options are passed', () => {
		const data = [{ id: 'A' }, { id: 'Z' }, { id: 'B' }];
		const sortedData = sorter(data, {});
		assert.notStrictEqual(sortedData, data);
		assert.deepEqual(sortedData, [{ id: 'A' }, { id: 'Z' }, { id: 'B' }]);
	});
	it('Should clone and sort data with sort options', () => {
		const data = [{ id: 'Z' }, { id: 'A' }, { id: 'A' }, { id: 'Z' }, { id: 'B' }];
		const ascSortedData = sorter(data, { sort: { columnId: 'id', direction: 'asc' } });
		assert.notStrictEqual(ascSortedData, data);
		assert.deepEqual(ascSortedData, [
			{ id: 'A' },
			{ id: 'A' },
			{ id: 'B' },
			{ id: 'Z' },
			{ id: 'Z' }
		]);
		const descSortedData = sorter(ascSortedData, {
			sort: { columnId: 'id', direction: 'desc' }
		});
		assert.notStrictEqual(descSortedData, ascSortedData);
		assert.deepEqual(descSortedData, [
			{ id: 'Z' },
			{ id: 'Z' },
			{ id: 'B' },
			{ id: 'A' },
			{ id: 'A' }
		]);
	});

	it('Should clone but not filter data when no filter options are passed', () => {
		const data = [{ id: 'A' }, { id: 'Z' }, { id: 'B' }];
		const filteredData = filterer(data, {});
		assert.notStrictEqual(filteredData, data);
		assert.deepEqual(filteredData, [{ id: 'A' }, { id: 'Z' }, { id: 'B' }]);
	});

	it('Should clone and filter data with filter options', () => {
		const data = [{ id: 'A' }, { id: 'Z' }, { id: 'B' }];
		const filteredData = filterer(data, { filter: { id: 'A' } });
		assert.notStrictEqual(filteredData, data);
		assert.deepEqual(filteredData, [{ id: 'A' }]);
	});

	it('Should clone and filter across multiple columns with filter options', () => {
		const data = [
			{ id: 'A', foo: 'bar' },
			{ id: 'Z', foo: 'bar' },
			{ id: 'B', foo: 'bar' },
			{ id: 'A', foo: 'foobar' }
		];
		const filteredData = filterer(data, { filter: { id: 'A', foo: 'bar' } });
		assert.notStrictEqual(filteredData, data);
		assert.deepEqual(filteredData, [{ id: 'A', foo: 'bar' }, { id: 'A', foo: 'foobar' }]);
	});

	it('Should return a fetcher result from the data for the page and pageSize', async () => {
		const data = [{ id: 'A' }, { id: 'Z' }, { id: 'B' }];
		const fetcherResult = await createFetcherResult(data, 1, 1);
		assert.notStrictEqual(fetcherResult.data, data);
		assert.deepEqual(fetcherResult.data, [{ id: 'A' }]);
		assert.deepEqual(fetcherResult.meta, {
			total: 3
		});
	});

	it('Created fetcher should run sort, filter and create a fetcher result', async () => {
		const data = [{ id: 'Ab' }, { id: 'Aa' }, { id: 'Z' }, { id: 'B' }];
		const fetcher = createFetcher(data);
		const fetcherResult = await fetcher(1, 2, {
			sort: { columnId: 'id', direction: 'asc' },
			filter: { id: 'A' }
		});
		assert.notStrictEqual(fetcherResult.data, data);
		assert.deepEqual(fetcherResult.data, [{ id: 'Aa' }, { id: 'Ab' }]);
		assert.deepEqual(fetcherResult.meta, {
			total: 2
		});
	});

	it('Created fetcher should only create a fetcher result when no fetcher options passed', async () => {
		const data = [{ id: 'Ab' }, { id: 'Aa' }, { id: 'Z' }, { id: 'B' }];
		const fetcher = createFetcher(data);
		const fetcherResult = await fetcher(1, 2);
		assert.notStrictEqual(fetcherResult.data, data);
		assert.deepEqual(fetcherResult.data, [{ id: 'Ab' }, { id: 'Aa' }]);
		assert.deepEqual(fetcherResult.meta, {
			total: 4
		});
	});

	it('Updater should replace the item using the default `id` value', () => {
		const data = [
			{ id: 'A', name: 'bob' },
			{ id: 'Z', name: 'bill' },
			{ id: 'B', name: 'ben' }
		];
		const updater = createUpdater(data);
		updater({ id: 'A', name: 'zane' });
		assert.deepEqual(data, [
			{ id: 'A', name: 'zane' },
			{ id: 'Z', name: 'bill' },
			{ id: 'B', name: 'ben' }
		]);
	});

	it('Updater should replace the item using a custom `id` property', () => {
		const data = [
			{ idd: 'A', name: 'bob' },
			{ idd: 'Z', name: 'bill' },
			{ idd: 'B', name: 'ben' }
		];
		const updater = createUpdater(data, 'idd');
		updater({ idd: 'A', name: 'zane' });
		assert.deepEqual(data, [
			{ idd: 'A', name: 'zane' },
			{ idd: 'Z', name: 'bill' },
			{ idd: 'B', name: 'ben' }
		]);
	});
});
