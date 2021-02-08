import { createResourceTemplate, defaultFilter } from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';
import { largeData as data, Data, largeListOptions as listOptions } from './data';

export const customDataTemplate = createResourceTemplate<Data>({
	idKey: 'id',
	read: async (req, { put }) => {
		await new Promise((res) => setTimeout(res, 1000));
		const { offset, size, query } = req;
		const filteredData = data.filter((item) => defaultFilter(query, item));
		put({ data: filteredData.slice(offset, offset + size), total: filteredData.length }, req);
	}
});

export const listOptionTemplate = createResourceTemplate<ListOption>({
	idKey: 'value',
	read: async (req, { put }) => {
		await new Promise((res) => setTimeout(res, 1000));
		const { offset, size, query } = req;
		const filteredData = listOptions.filter((item) => defaultFilter(query, item));
		put({ data: filteredData.slice(offset, offset + size), total: filteredData.length }, req);
	}
});
