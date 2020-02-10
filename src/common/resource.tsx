import { Resource, ResourceOptions } from '@dojo/framework/core/middleware/data';
import { string } from '@dojo/parade/main.css';

export interface ReadOptions {
	offset?: number;
	size?: number;
	query?: string;
}

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
	let invalidators = new Set();

	function invalidate() {
		[...invalidators].forEach((invalidator: any) => {
			invalidator();
		});
	}

	function getKey({ pageNumber, query, pageSize }: ResourceOptions): string {
		return `page-${pageNumber}-pageSize-${pageSize}-query-${query}`;
	}

	function getOrRead(options: ResourceOptions, invalidator: () => void) {
		invalidators.add(invalidator);
		const { pageNumber, query, pageSize } = options;
		const key = getKey(options);

		if (dataMap.has(key)) {
			const keyedData = dataMap.get(key);
			if (keyedData === Status.INPROGRESS) {
				invalidate();
				return undefined;
			} else {
				return {
					data: keyedData,
					total: totalMap.get(key)
				};
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

				response.then(({ data, total }) => {
					dataMap.set(key, data);
					totalMap.set(key, total);
					invalidate();
				});
				return undefined;
			} else {
				dataMap.set(key, response.data);
				totalMap.set(key, response.total);
				return response;
			}
		}
	}

	return {
		getOrRead
	};
}
