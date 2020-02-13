import { create, tsx } from '@dojo/framework/core/vdom';
import Menu, { MenuOption } from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource, createTransformer, DataTemplate } from '@dojo/widgets/common/resource';

const fetcher = async (options: any) => {
	const { offset, size, query } = options;
	let url = `https://mixolydian-appendix.glitch.me/user?`;

	const pageNumber = offset / size + 1;
	url = `${url}page=${pageNumber}&size=${size}`;

	if (query) {
		url = `${url}&firstName=${query}`;
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

const transformer = createTransformer(template, (data) => {
	return {
		value: `${data.firstName} ${data.lastName}`
	};
});

const resource = createResource(template);

const factory = create({ icache });

export default factory(function LargeOptionSet({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
				resource={resource}
				transform={transformer}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
