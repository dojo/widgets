import { FetcherOptions, FetcherResult } from './interfaces';
import { findIndex } from '@dojo/framework/shim/array';

export function sorter(data: any[], { sort }: FetcherOptions): any[] {
	const temp = [...data];
	if (sort) {
		temp.sort((a, b) => {
			const left = sort.direction === 'asc' ? b : a;
			const right = sort.direction === 'asc' ? a : b;
			if (left[sort.columnId] < right[sort.columnId]) {
				return 1;
			}
			if (left[sort.columnId] > right[sort.columnId]) {
				return -1;
			}
			return 0;
		});
	}
	return temp;
}

export function filterer(data: any[], { filter }: FetcherOptions): any[] {
	if (filter) {
		return data.filter((item) => {
			let match = true;
			Object.keys(filter).forEach((columnId) => {
				if (item[columnId].toLowerCase().indexOf(filter[columnId].toLowerCase()) === -1) {
					match = false;
				}
			});
			return match;
		});
	}
	return [...data];
}

export async function createFetcherResult(
	data: any[],
	page: number,
	pageSize: number
): Promise<FetcherResult> {
	const temp = [...data];
	const block = [...temp].splice((page - 1) * pageSize, pageSize);
	return { data: block, meta: { total: temp.length } };
}

export function createUpdater<S extends any>(data: S[], idColumn: string = 'id') {
	return (updatedItem: S) => {
		const index = findIndex(data, (item: any) => {
			return item[idColumn] === (updatedItem as any)[idColumn];
		});
		data[index] = updatedItem;
	};
}

export function createFetcher(data: any[]) {
	return async (
		page: number,
		pageSize: number,
		options: FetcherOptions = {}
	): Promise<FetcherResult> => {
		return createFetcherResult(sorter(filterer(data, options), options), page, pageSize);
	};
}
