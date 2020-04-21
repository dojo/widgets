import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource, createTransformer, DataTemplate } from '@dojo/framework/core/resource';
import Example from '../../Example';

const fetcher = async (options: any) => {
	const { offset, size, query } = options;
	let url = `https://mixolydian-appendix.glitch.me/user?`;

	const pageNumber = offset / size + 1;
	url = `${url}page=${pageNumber}&size=${size}`;

	if (query) {
		Object.keys(query).forEach((key) => {
			if (query[key]) {
				url = `${url}&${key}=${query[key]}`;
			}
		});
	}

	const response = await fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	const data = await response.json();

	return {
		data: data.data,
		total: data.total
	};
};

const template: DataTemplate<{ firstName: string; lastName: string }> = {
	read: fetcher
};

const transformer = createTransformer(template, {
	value: ['firstName'],
	label: ['firstName', 'lastName']
});

const resource = createResource(template);

const factory = create({ icache });

export default factory(function FetchedResource({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={resource}
				transform={transformer}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
