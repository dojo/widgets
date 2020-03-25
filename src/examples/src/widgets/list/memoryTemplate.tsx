import { DataTemplate } from '@dojo/framework/core/resource';

export function createMemoryTemplate<S = void>(): DataTemplate<S> {
	return {
		read: ({ query }, put, get) => {
			let data: any[] = get();
			put(0, data);
			return { data, total: data.length };
		}
	};
}
