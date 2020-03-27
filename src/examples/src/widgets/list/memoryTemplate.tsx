import { DataTemplate, createResource } from '@dojo/framework/core/resource';

export function createMemoryResourceWithData<S = any>(data: S[]) {
	const memoryTemplate = createMemoryTemplate<S>();

	return {
		resource: () => createResource(memoryTemplate),
		data
	};
}

export function createMemoryTemplate<S = void>(): DataTemplate<S> {
	return {
		read: ({ query }, put, get) => {
			let data: any[] = get();
			put(0, data);
			return { data, total: data.length };
		}
	};
}
