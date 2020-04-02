import { DataTemplate, createResource, ResourceQuery } from '@dojo/framework/core/resource';

export function createMemoryResourceWithData<S = any>(data: S[]) {
	const memoryTemplate = createMemoryTemplate<S>();

	return {
		resource: () => createResource(memoryTemplate),
		data
	};
}

export function defaultFilter(query: ResourceQuery[], v: any) {
	let filterValue = '';

	query.forEach((q) => {
		if (q.keys.indexOf('value') >= -1) {
			filterValue = q.value || '';
		}
	});

	if (!filterValue) {
		return true;
	}

	let filterText = v.label || v.value;
	return filterText.toLocaleLowerCase().indexOf(filterValue.toLocaleLowerCase()) >= 0;
}

export function createMemoryResourceWithDataAndFilter<S = any>(
	data: S[],
	filter?: (query: ResourceQuery[], v: S) => boolean
) {
	const memoryTemplate = createMemoryTemplate<S>({ filter: filter || defaultFilter });

	return {
		resource: () => createResource(memoryTemplate),
		data
	};
}

export function createMemoryTemplate<S = void>({
	filter
}: { filter?: (query: ResourceQuery[], v: S) => boolean } = {}): DataTemplate<S> {
	return {
		read: ({ query }, put, get) => {
			let data: any[] = get();
			const filteredData = filter && query ? data.filter((i) => filter(query, i)) : data;
			put(0, filteredData);
			return { data: filteredData, total: filteredData.length };
		}
	};
}
