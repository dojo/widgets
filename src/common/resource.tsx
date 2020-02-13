import { Resource, ResourceOptions, SubscriptionType } from './data';

export interface ReadOptions {
	offset?: number;
	size?: number;
	query?: string;
}

type Invalidator = () => void;

export type DataResponse<S> = { data: S[]; total: number };
export type DataResponsePromise<S> = Promise<{ data: S[]; total: number }>;
export type DataFetcher<S> = (options: ReadOptions) => DataResponse<S> | DataResponsePromise<S>;

export interface DataTemplate<S> {
	read: DataFetcher<S>;
}

export function createTransformer<S, T>(template: DataTemplate<S>, transformer: (data: S) => T) {
	return transformer;
}

type Status = 'INPROGRESS' | 'FAILED';

function isAsyncResponse<S>(
	response: DataResponsePromise<S> | DataResponse<S>
): response is DataResponsePromise<S> {
	return (response as any).then !== undefined;
}

export function createResource<S>(config: DataTemplate<S>): Resource {
	const { read } = config;
	let dataMap = new Map<string, S[] | Status>();
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
		return dataMap.get(key) === 'INPROGRESS';
	}

	function isFailed(options: ResourceOptions) {
		const key = getKey(options);
		return dataMap.get(key) === 'FAILED';
	}

	function getTotal(options: ResourceOptions) {
		const totalKey = getTotalKey(options);
		return totalMap.get(totalKey);
	}

	function getOrRead(options: ResourceOptions): S[] | undefined {
		const { pageNumber, query, pageSize } = options;
		const key = getKey(options);
		const totalKey = getTotalKey(options);

		if (dataMap.has(key)) {
			const keyedData = dataMap.get(key);
			if (keyedData === 'INPROGRESS' || keyedData === 'FAILED') {
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
				dataMap.set(key, 'INPROGRESS');
				invalidate(key, ['loading']);

				response
					.then(({ data, total }) => {
						dataMap.set(key, data);
						invalidate(key, ['loading', 'data']);
						if (total !== totalMap.get(totalKey)) {
							totalMap.set(totalKey, total);
							invalidate(key, ['total']);
						}
					})
					.catch(() => {
						dataMap.set(key, 'FAILED');
						invalidate(key, ['failed', 'loading']);
					});

				return undefined;
			} else {
				dataMap.set(key, response.data);
				if (response.total !== totalMap.get(totalKey)) {
					totalMap.set(totalKey, response.total);
				}
				return response.data;
			}
		}
	}

	return {
		getOrRead,
		getTotal,
		subscribe,
		unsubscribe,
		isFailed,
		isLoading
	};
}
