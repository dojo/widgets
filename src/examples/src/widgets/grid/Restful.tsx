import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { FetcherOptions, FetcherResult } from '@dojo/widgets/grid/interfaces';
import Example from '../../Example';

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

async function fetcher(
	page: number,
	size: number,
	options: FetcherOptions = {}
): Promise<FetcherResult<any>> {
	let url = `https://mixolydian-appendix.glitch.me/user?page=${page}&size=${size}`;
	const { filter, sort } = options;
	if (filter) {
		Object.keys(filter).forEach((key) => {
			url = `${url}&${key}=${filter[key]}`;
		});
	}
	if (sort) {
		url = `${url}&sort=${sort.columnId}&direction=${sort.direction}`;
	}
	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();
	return {
		data: data.data,
		meta: {
			total: data.total
		}
	};
}

const factory = create();
export default factory(() => {
	return (
		<Example>
			<Grid fetcher={fetcher} columnConfig={columnConfig} height={450} />
		</Example>
	);
});
