import { create, invalidator } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache, invalidator });

export function createResource<T>(config: ResourceConfig<T>) {
	return factory(({ id, middleware: { icache, invalidator } }) => {
		const { read } = config;
		const resourceId = `resource-${id}`;

		function constructId(resourceId: string, options: GetOrReadOptions) {
			let baseId = resourceId;
			if (options.pagination) {
				baseId += `-pagination-${options.pagination.offset}`;
			}
			if (options.query) {
				baseId += `-query-${options.query}`;
			}
			return baseId;
		}

		function getOrRead(options: GetOrReadOptions = {}) {
			return icache.getOrSet(constructId(resourceId, options), () => read(options));
		}

		return {
			getOrRead
		};
	});
}
