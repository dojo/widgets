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
import List from '@dojo/widgets/list';
import { parse } from 'path';

const resource = createResourceMiddleware();

const columns = [
	{ id: 'city', title: 'city', sortable: 'string', filterable: true },
	{ id: 'state', title: 'state', sortable: 'string', filterable: true },
	{ id: 'growth_from_2000_to_2013', title: 'growth' },
	{ id: 'map', title: 'map' },
	{ id: 'population', title: 'population', sortable: 'number' },
	{ id: 'rank', title: 'rank', sortable: 'number' }
];

function defaultSort(data: City[], id: keyof City, type: 'string' | 'number', asc: boolean) {
	if (type === 'string') {
		return data.sort((a, b) => {
			if (a[id] === b[id]) {
				return 0;
			}
			if (asc) {
				return a[id] > b[id] ? 1 : -1;
			} else {
				return a[id] > b[id] ? -1 : 1;
			}
		});
	} else {
		return data.sort((a, b) => {
			const numA = +a[id];
			const numB = +b[id];

			return asc ? numA - numB : numB - numA;
		});
	}
}

const gridTemplate = createResourceTemplateWithInit<any, { data: City[] }>({
	init: ({ data }, { put }) => {
		put({ data, total: data.length }, { offset: 0, size: 30, query: {} });
	},
	find: defaultFind,
	read: async (request, { put, get }) => {
		const { data } = get();
		const { offset, size } = request;
		const { __sort__: sort, ...queryFields } = request.query as {
			__sort__: any; // { id: keyof City; type: 'string' | 'number'; asc: boolean};
			[key: string]: string;
		};

		const filteredData = Object.keys(queryFields).length
			? data.filter((item) => item && defaultFilter(queryFields, item, 'contains'))
			: data;

		const sortedData = defaultSort(filteredData, sort.id, sort.type, sort.asc);

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
	const { createOptions } = resource;
	const options = createOptions('foo');

	return (
		<Example>
			<div>
				<h3>City</h3>
				<TextInput
					onValue={(value) => {
						const { query } = options();
						options({
							query: {
								...query,
								city: value
							}
						});
					}}
				/>
				<h3>States</h3>
				<List
					itemsInView={5}
					onValue={(value) => {
						const { query } = options();
						options({
							query: {
								...query,
								state: value
							}
						});
					}}
					resource={resource({
						template: gridTemplate,
						transform: { value: 'state' },
						initOptions: { id, data: cities }
					})}
				/>
				<h3>Grid</h3>
				<div styles={{ height: '600px', overflow: 'hidden' }}>
					<Grid
						resource={resource({
							template: gridTemplate,
							options,
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
			</div>
		</Example>
	);
});
