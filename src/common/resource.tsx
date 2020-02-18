import { Resource, ResourceOptions, SubscriptionType } from './data';

export interface ReadOptions {
	offset?: number;
	size?: number;
	query?: string;
}

type Invalidator = () => void;

type Putter<S> = (start: number, data: S[]) => void;
type Getter<S> = (query: string) => S[];

export type DataResponse<S> = { data: S[]; total: number };
export type DataResponsePromise<S> = Promise<{ data: S[]; total: number }>;
export type DataFetcher<S> = (
	options: ReadOptions,
	put: Putter<S>,
	get: Getter<S>
) => DataResponse<S> | DataResponsePromise<S>;

export interface DataTemplate<S> {
	read: DataFetcher<S>;
	set?: any;
}

export function createTransformer<S, T>(template: DataTemplate<S>, transformer: (data: S) => T) {
	return transformer;
}

type Status = 'LOADING' | 'FAILED';

function isAsyncResponse<S>(
	response: DataResponsePromise<S> | DataResponse<S>
): response is DataResponsePromise<S> {
	return (response as any).then !== undefined;
}

export function createResource<S>(config: DataTemplate<S>): Resource {
	const { read } = config;
	let queryMap = new Map<string, S[]>(); // sparse array of items
	let statusMap = new Map<string, Status>();
	let totalMap = new Map<string, number>();

	const invalidatorMaps = {
		data: new Map<string, Set<Invalidator>>(),
		total: new Map<string, Set<Invalidator>>(),
		loading: new Map<string, Set<Invalidator>>(),
		failed: new Map<string, Set<Invalidator>>()
	};

	function invalidate(key: string, types: SubscriptionType[]) {
		types.forEach((type) => {
			const keyedInvalidatorMap = invalidatorMaps[type];
			const invalidatorSet = keyedInvalidatorMap.get(key);
			if (invalidatorSet) {
				[...invalidatorSet].forEach((invalidator: any) => {
					invalidator();
				});
			}
		});
	}

	function getKey({ pageNumber, query, pageSize }: ResourceOptions): string {
		return `page-${pageNumber}-pageSize-${pageSize}-query-${query}`;
	}

	function getTotalKey({ query = '' }: ResourceOptions): string {
		return query;
	}

	function subscribe(type: SubscriptionType, options: ResourceOptions, invalidator: Invalidator) {
		const key = getKey(options);
		const keyedInvalidatorMap = invalidatorMaps[type];
		const invalidatorSet = keyedInvalidatorMap.get(key) || new Set<Invalidator>();
		invalidatorSet.add(invalidator);
		keyedInvalidatorMap.set(key, invalidatorSet);
	}

	function unsubscribe(invalidator: Invalidator) {
		Object.keys(invalidatorMaps).forEach((type) => {
			const keyedInvalidatorMap = invalidatorMaps[type as SubscriptionType];

			const keys = keyedInvalidatorMap.keys();
			[...keys].forEach((key) => {
				const invalidatorSet = keyedInvalidatorMap.get(key);
				if (invalidatorSet && invalidatorSet.has(invalidator)) {
					invalidatorSet.delete(invalidator);
					keyedInvalidatorMap.set(key, invalidatorSet);
				}
			});
		});
	}

	function isLoading(options: ResourceOptions) {
		const key = getKey(options);
		return statusMap.get(key) === 'LOADING';
	}

	function isFailed(options: ResourceOptions) {
		const key = getKey(options);
		return statusMap.get(key) === 'FAILED';
	}

	function getTotal(options: ResourceOptions) {
		const totalKey = getTotalKey(options);
		return totalMap.get(totalKey);
	}

	function get(options: ResourceOptions): S[] {
		const { pageNumber, query = '', pageSize } = options;

		const cachedQueryData = queryMap.get(query);

		if (!cachedQueryData) {
			return [];
		}

		if (pageSize && pageNumber) {
			const start = (pageNumber - 1) * pageSize;
			const end = start + pageSize;
			const total = totalMap.get(query) || end;
			const calculatedEnd = Math.min(end, total);
			const requiredData = cachedQueryData.slice(start, calculatedEnd);
			if (requiredData.filter(() => true).length === calculatedEnd - start) {
				return requiredData;
			} else {
				return [];
			}
		} else {
			return cachedQueryData;
		}
	}

	function setData(start: number, data: S[], size: number, query = '') {
		console.log(`set data called with start: ${start}, size: ${size}, query: ${query}`);
		const cachedQueryData = queryMap.get(query);
		const newQueryData = cachedQueryData && cachedQueryData.length ? cachedQueryData : [];

		for (let i = 0; i < size; i += 1) {
			newQueryData[start + i] = data[i];
		}

		queryMap.set(query, newQueryData);
	}

	function getOrRead(options: ResourceOptions): S[] | undefined {
		const { pageNumber, query = '', pageSize } = options;
		const key = getKey(options);

		if (isLoading(options) || isFailed(options)) {
			return undefined;
		}

		const cachedQueryData = queryMap.get(query);

		if (
			cachedQueryData &&
			(!pageSize || !pageNumber) &&
			cachedQueryData.filter(() => true).length === totalMap.get(query)
		) {
			return cachedQueryData;
		}

		if (pageSize && pageNumber && cachedQueryData && cachedQueryData.length) {
			const start = (pageNumber - 1) * pageSize;
			const end = start + pageSize;
			const total = totalMap.get(query) || end;
			const calculatedEnd = Math.min(end, total);
			const requiredData = cachedQueryData.slice(start, calculatedEnd);
			if (
				requiredData.length &&
				requiredData.filter(() => true).length === calculatedEnd - start
			) {
				return requiredData;
			}
		}

		const readOptions: ReadOptions = {};

		if (pageNumber !== undefined && pageSize !== undefined) {
			readOptions.offset = (pageNumber - 1) * pageSize;
			readOptions.size = pageSize;
		}

		if (query) {
			readOptions.query = query;
		}

		const response = read(
			readOptions,
			(start = 0, data: S[]) => {
				setData(start, data, data.length, query);
			},
			(query = '') => {
				return get({ query });
			}
		);

		if (isAsyncResponse(response)) {
			statusMap.set(key, 'LOADING');
			invalidate(key, ['loading']);

			response
				.then(({ data, total }) => {
					const start = readOptions.offset || 0;
					const size = Math.min(data.length, readOptions.size || data.length);
					setData(start, data, size, query);

					statusMap.delete(key);
					invalidate(key, ['loading', 'data']);
					if (total !== totalMap.get(query)) {
						totalMap.set(query, total);
						invalidate(key, ['total']);
					}
				})
				.catch(() => {
					statusMap.set(key, 'FAILED');
					invalidate(key, ['failed', 'loading']);
				});

			return undefined;
		} else {
			const { data, total } = response;
			const start = readOptions.offset || 0;
			const size = Math.min(data.length, readOptions.size || data.length);
			setData(start, data, size, query);
			invalidate(key, ['data']);

			if (total !== totalMap.get(query)) {
				totalMap.set(query, total);
				invalidate(key, ['total']);
			}
			return data;
		}
	}

	return {
		getOrRead,
		get,
		getTotal,
		subscribe,
		unsubscribe,
		isFailed,
		isLoading,
		set(data: S[]) {
			setData(0, data, data.length);
		}
	};
}
