import { create, invalidator, destroy, diffProperty } from '@dojo/framework/core/vdom';
import { createResource, DataTemplate } from './resource';
import { invalidate } from '@dojo/framework/i18n/i18n';

export type Invalidator = () => void;

export type SubscriptionType = 'data' | 'total' | 'loading' | 'failed';

export interface ResourceOptions {
	pageNumber?: number;
	query?: string;
	pageSize?: number;
}

export interface Resource {
	getOrRead(options: ResourceOptions): any;
	get(options: ResourceOptions): any;
	getTotal(options: ResourceOptions): number | undefined;
	isLoading(options: ResourceOptions): boolean;
	isFailed(options: ResourceOptions): boolean;
	subscribe(type: SubscriptionType, options: ResourceOptions, invalidator: Invalidator): void;
	unsubscribe(invalidator: Invalidator): void;
	set(data: any[]): void;
}

interface OptionsWrapper {
	getOptions(invalidator: Invalidator): ResourceOptions;
	setOptions(newOptions: ResourceOptions, invalidator: Invalidator): void;
}

export interface ResourceWrapper {
	resource: Resource;
	createOptionsWrapper(): OptionsWrapper;
}

export interface ResourceWithData {
	resource: Resource;
	data: any[];
}

export type ResourceOrResourceWrapper = Resource | ResourceWrapper | ResourceWithData;

export type Transformer<T> = (item: any) => T;

interface DataProperties {
	resource: ResourceOrResourceWrapper | any[];
}

interface DataTransformProperties<T = void> {
	transform: Transformer<T>;
	resource: ResourceOrResourceWrapper | T[];
}

interface DataInitialiserOptions {
	reset?: boolean;
	resource?: ResourceOrResourceWrapper;
	key?: string;
}

function isResource(resourceWrapperOrResource: any): resourceWrapperOrResource is Resource {
	return !!(resourceWrapperOrResource as any).getOrRead;
}

function isDataTransformProperties<T>(properties: any): properties is DataTransformProperties<T> {
	return !!properties.transform;
}

function createOptionsWrapper(): OptionsWrapper {
	let options: ResourceOptions = {};

	const invalidators = new Set<Invalidator>();

	function invalidate() {
		[...invalidators].forEach((invalidator) => {
			invalidator();
		});
	}

	return {
		setOptions(newOptions: ResourceOptions, invalidator: Invalidator) {
			invalidators.add(invalidator);
			if (newOptions !== options) {
				options = newOptions;
				invalidate();
			}
		},
		getOptions(invalidator: Invalidator) {
			invalidators.add(invalidator);
			return options;
		}
	};
}

function createResourceWrapper(resource: Resource, options?: OptionsWrapper): ResourceWrapper {
	return {
		resource,
		createOptionsWrapper: options ? () => options : createOptionsWrapper
	};
}

// function createMemoryTemplate<T>(data: T[]): DataTemplate<T> {
// 	return {
// 		read: ({ query = '', size, offset }, put) => {
// 			if (size !== undefined && offset !== undefined) {
// 				put(0, data);
// 				return { data: data.slice(offset, offset + size), total: data.length };
// 			} else {
// 				return { data, total: data.length };
// 			}
// 		}
// 	}
// }

function isResourceWithData(resource: any): resource is ResourceWithData {
	return !!resource.data;
}

export function createDataMiddleware<T = void>() {
	const factory = create({ invalidator, destroy, diffProperty }).properties<
		T extends void ? DataProperties : DataTransformProperties<T>
	>();

	const data = factory(({ middleware: { invalidator, destroy, diffProperty }, properties }) => {
		const optionsWrapperMap = new Map<Resource, Map<string, OptionsWrapper>>();
		const resourceWithDataMap = new Map<T[], Resource>();

		destroy(() => {
			[...optionsWrapperMap.keys()].forEach((resource) => {
				resource.unsubscribe(invalidator);
			});
		});

		// diffProperty('resource', (current, next) => {
		// 	if (typeof next === 'function' && current !== next) {
		// 		invalidate();
		// 	} else if ()
		// });

		return (dataOptions: DataInitialiserOptions = {}) => {
			let passedResourceProperty = dataOptions.resource || properties().resource;
			let resourceWrapperOrResource;

			if (isResourceWithData(passedResourceProperty)) {
				const { resource, data } = passedResourceProperty;
				if (!resourceWithDataMap.has(data)) {
					resourceWithDataMap.set(data, resource);
					resource.set(data);
				}
				resourceWrapperOrResource = resourceWithDataMap.get(data);
			} else {
				resourceWrapperOrResource = passedResourceProperty;
			}

			let resourceWrapper: ResourceWrapper;

			if (isResource(resourceWrapperOrResource)) {
				resourceWrapper = createResourceWrapper(resourceWrapperOrResource);
			} else {
				resourceWrapper = resourceWrapperOrResource as ResourceWrapper;
			}

			if (dataOptions.reset) {
				resourceWrapper = createResourceWrapper(resourceWrapper.resource);
			}

			const { resource } = resourceWrapper;
			const { key = '' } = dataOptions;

			let keyedCachedOptions = optionsWrapperMap.get(resource);
			if (!keyedCachedOptions) {
				keyedCachedOptions = new Map<string, OptionsWrapper>();
			}

			let cachedOptions = keyedCachedOptions.get(key);
			let optionsWrapper: OptionsWrapper;

			if (cachedOptions) {
				optionsWrapper = cachedOptions;
			} else {
				const newOptionsWrapper = resourceWrapper.createOptionsWrapper();
				keyedCachedOptions.set(key, newOptionsWrapper);
				optionsWrapperMap.set(resource, keyedCachedOptions);
				optionsWrapper = newOptionsWrapper;
			}

			return {
				getOrRead(options: ResourceOptions): T extends void ? any : T[] | undefined {
					resource.subscribe('data', options, invalidator);
					const data = resource.getOrRead(options);
					const props = properties();

					if (data && data.length && isDataTransformProperties(props)) {
						return data.map(props.transform);
					}

					return data;
				},
				get(options: ResourceOptions): T extends void ? any : T[] | undefined {
					const data = resource.get(options);
					const props = properties();

					if (data && data.length && isDataTransformProperties(props)) {
						return data.map(props.transform);
					}

					return data;
				},
				getTotal(options: ResourceOptions) {
					resource.subscribe('total', options, invalidator);
					return resource.getTotal(options);
				},
				isLoading(options: ResourceOptions) {
					resource.subscribe('loading', options, invalidator);
					return resource.isLoading(options);
				},
				isFailed(options: ResourceOptions) {
					resource.subscribe('failed', options, invalidator);
					return resource.isFailed(options);
				},
				setOptions(newOptions: ResourceOptions) {
					optionsWrapper.setOptions(newOptions, invalidator);
				},
				getOptions() {
					return optionsWrapper.getOptions(invalidator);
				},
				get resource() {
					return resourceWrapper;
				},
				shared() {
					return createResourceWrapper(resource, optionsWrapper);
				}
			};
		};
	});
	return data;
}

export const data = createDataMiddleware();

export default data;
