import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { FetcherOptions } from '@dojo/widgets/grid/interfaces';

const columnConfig = [
	{
		id: 'id',
		title: 'ID'
	},
	{
		id: 'firstName',
		title: 'First Name'
	},
	{
		id: 'lastName',
		title: 'Last Name'
	}
];

const fetcher = async (page: number, pageSize: number, options: FetcherOptions = {}) => {
	const offset = (page - 1) * pageSize;
	const response = await fetch(
		`https://mock-json-server.now.sh/data?offset=${offset}&size=${pageSize}`,
		{
			method: 'POST',
			body: JSON.stringify({
				sort: options.sort,
				filter: options.filter,
				offset,
				size: pageSize
			}),
			headers: {
				'Content-Type': 'application/json'
			}
		}
	);
	const json = await response.json();
	return { data: json.data, meta: { total: json.total } };
};

const factory = create();
export default factory(() => {
	return <Grid fetcher={fetcher} columnConfig={columnConfig} height={450} />;
});
