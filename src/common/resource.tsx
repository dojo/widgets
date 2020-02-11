import { Resource, ResourceOptions } from '@dojo/framework/core/middleware/data';

export interface ReadOptions {
	offset?: number;
	size?: number;
	query?: string;
}

type Invalidator = () => void;

export type DataResponse<S> = { data: S[]; total: number };
export type DataResponsePromise<S> = Promise<{ data: S[]; total: number }>;
export type DataFetcher<S> = (options: ReadOptions) => DataResponse<S>;

export interface DataTemplate<S> {
	read: DataFetcher<S>;
}

export function createTransformer<S, T>(template: DataTemplate<S>, transformer: (data: S) => T) {
	return transformer;
}

enum Status {
	'INPROGRESS'
}

function isAsyncResponse<S>(
	response: DataResponsePromise<S> | DataResponse<S>
): response is DataResponsePromise<S> {
	return (response as any).then !== undefined;
}

export function createResource<S>(config: DataTemplate<S>): Resource {
	const { read } = config;
	let dataMap = new Map<string, S[] | Status>();
	let totalMap = new Map<string, number>();

	let keyedInvalidators = new Map<string, Set<Invalidator>>();

	function invalidate(key: string) {
		const invalidators = keyedInvalidators.get(key);
		if (invalidators) {
			[...invalidators].forEach((invalidator: any) => {
				invalidator();
			});
		}
		keyedInvalidators.delete(key);
	}

	function getKey({ pageNumber, query, pageSize }: ResourceOptions): string {
		return `page-${pageNumber}-pageSize-${pageSize}-query-${query}`;
	}

	function addInvalidator(key: string, invalidator: Invalidator) {
		const invalidatorSet = keyedInvalidators.get(key) || new Set<Invalidator>();
		invalidatorSet.add(invalidator);
		keyedInvalidators.set(key, invalidatorSet);
	}

	function getTotal(options: ResourceOptions, invalidator: Invalidator) {
		const key = getKey(options);
		const total = totalMap.get(key);

		if (total !== undefined) {
			return total;
		} else {
			addInvalidator(key, invalidator);
			return undefined;
		}
	}

	function getOrRead(options: ResourceOptions, invalidator: Invalidator): S[] | undefined {
		const { pageNumber, query, pageSize } = options;
		const key = getKey(options);

		if (dataMap.has(key)) {
			const keyedData = dataMap.get(key);
			if (keyedData === Status.INPROGRESS) {
				addInvalidator(key, invalidator);
				return undefined;
			} else {
				return keyedData;
			}
		} else {
			const readOptions: ReadOptions = {};

			if (pageNumber !== undefined && pageSize !== undefined) {
				readOptions.offset = (pageNumber - 1) * pageSize;
				readOptions.size = pageSize;
			}

			if (query) {
				readOptions.query = query;
			}

			const response = read(readOptions);

			if (isAsyncResponse(response)) {
				dataMap.set(key, Status.INPROGRESS);
				addInvalidator(key, invalidator);

				response.then(({ data, total }) => {
					dataMap.set(key, data);
					totalMap.set(key, total);
					invalidate(key);
				});

				return undefined;
			} else {
				dataMap.set(key, response.data);
				totalMap.set(key, response.total);
				return response.data;
			}
		}
	}

	return {
		getOrRead,
		getTotal
	};
}
