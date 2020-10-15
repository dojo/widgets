import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/resource-grid';
import Example from '../../Example';
import {
	createResourceMiddleware,
	createResourceTemplateWithInit,
	defaultFind,
	defaultFilter
} from '@dojo/framework/core/middleware/resources';
import TextInput from '@dojo/widgets/text-input';
import cities, { City } from './cities';

const resource = createResourceMiddleware();

const columns = [
	{ id: 'city', title: 'city', sortable: true, filterable: true },
	{ id: 'state', title: 'state', sortable: true, filterable: true },
	{ id: 'growth_from_2000_to_2013', title: 'growth' },
	{ id: 'map', title: 'map' },
	{ id: 'population', title: 'population', sortable: true },
	{ id: 'rank', title: 'rank', sortable: true }
];

const gridTemplate = createResourceTemplateWithInit<City, { data: City[] }>({
	init: ({ data }, { put }) => {
		put({ data, total: data.length }, { offset: 0, size: 30, query: {} });
	},
	find: defaultFind,
	read: async (request, { put, get }) => {
		const { data } = get();
		const { offset, size } = request;
		const { sort, ...queryFields } = request.query as {
			sort: keyof City;
			[key: string]: string;
		};

		const filteredData = Object.keys(queryFields).length
			? data.filter((item) => item && defaultFilter(queryFields, item, 'contains'))
			: data;

		const sortedData = sort
			? filteredData.sort((a, b) => {
					if (a[sort] === b[sort]) {
						return 0;
					}
					return a[sort] > b[sort] ? 1 : -1;
			  })
			: filteredData;

		put({ data: sortedData.slice(offset, offset + size), total: sortedData.length }, request);
	}
});

const factory = create({ resource });

export default factory(function Basic({ id, middleware: { resource } }) {
	return (
		<Example>
			<div styles={{ height: '600px', overflow: 'hidden' }}>
				<Grid
					resource={resource({
						template: gridTemplate,
						initOptions: { id, data: cities }
					})}
					columns={columns}
				>
					{{
						header: {
							state: ({ title, onFilter, onSort }) => {
								return (
									<virtual>
										<TextInput onValue={onFilter} />
										{`** ${title} **`}
										<button onclick={onSort}>^</button>
									</virtual>
								);
							}
						},
						cell: {
							map: (item: City, rowIndex) => {
								return (
									<a
										styles={{ color: 'blue' }}
										href={`https://www.google.co.uk/maps/place/${
											item.latitude
										},${item.longitude}`}
										target="_blank"
									>
										click
									</a>
								);
							}
						},
						footer: (total) => `custom footer total is ${total}`
					}}
				</Grid>
			</div>
		</Example>
	);
});
