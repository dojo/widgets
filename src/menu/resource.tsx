import { create, invalidator } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache, invalidator });

export interface Resource<T> {
	getOrRead(options?: GetOrReadOptions): undefined | T[];
}

export interface Response<T> {
	data: T[];
	total?: number;
}

export interface PaginationOptions {
	offset: number;
	size: number;
}

export interface Read<T> {
	(options?: GetOrReadOptions): Promise<Response<T>> | Response<T>;
}

export interface ResourceConfig<T> {
	read: Read<T>;
}

export interface GetOrReadOptions {
	pagination?: PaginationOptions;
	query?: string;
}

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
