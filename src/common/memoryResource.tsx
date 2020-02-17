import { Resource, ResourceOptions } from './data';

export function createMemoryResource<S>(
	resourceArray: S[],
	filter: (item: S, query: string) => boolean
): Resource {
	let queryMap = new Map<string, S[]>();

	function getTotal({ query }: ResourceOptions) {
		if (query) {
			const results = queryMap.get(query);
			if (results && results.length) {
				return results.length;
			}
		} else {
			return resourceArray.length;
		}
	}

	function get(options: ResourceOptions): S[] {
		const { pageNumber, query = '', pageSize } = options;

		let cachedQueryData = queryMap.get(query);
		if (!cachedQueryData) {
			cachedQueryData = resourceArray.filter((item: S) => {
				return filter(item, query);
			});
			queryMap.set(query, cachedQueryData);
		}

		if (pageSize && pageNumber) {
			const start = (pageNumber - 1) * pageSize;
			const end = start + pageSize;
			const requiredData = cachedQueryData.slice(start, end);
			return requiredData;
		} else {
			return cachedQueryData;
		}
	}

	return {
		getOrRead: get,
		get,
		getTotal,
		subscribe: () => {},
		unsubscribe: () => {},
		isFailed: () => false,
		isLoading: () => false
	};
}
