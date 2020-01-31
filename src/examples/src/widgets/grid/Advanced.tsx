import { create, tsx } from '@dojo/framework/core/vdom';
import Grid from '@dojo/widgets/grid';
import icache from '@dojo/framework/core/middleware/icache';
import { FetcherOptions, FetcherResult, ColumnConfig } from '@dojo/widgets/grid/interfaces';
import TextInput from '@dojo/widgets/text-input';

/**
 * Custom fetcher that builds the API url based on the page/pageSize and filters.
 * Provides remote pagination combined with filters.
 */
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

/**
 * Custom updater that builds the API url based on the update item.
 * Provides remote updates for grid data.
 */
async function updater(item: any) {
	const { id, ...data } = item;
	const url = `https://mixolydian-appendix.glitch.me/user/${id}`;
	await fetch(url, {
		body: JSON.stringify(data),
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		}
	});
}

const factory = create({ icache });

const columnConfig: ColumnConfig[] = [
	{
		id: 'firstName',
		title: 'First Name',
		filterable: true,
		sortable: true,
		editable: true,
		resizable: true
	},
	{
		id: 'lastName',
		title: 'Last Name',
		filterable: true,
		sortable: true,
		editable: true,
		resizable: true
	},
	{
		id: 'phoneNumber',
		title: 'Phone #',
		filterable: true,
		sortable: true,
		editable: true,
		resizable: true
	},
	{
		id: 'country',
		title: 'Country',
		filterable: true,
		sortable: true,
		editable: true,
		resizable: true
	}
];

interface Item {
	firstName: string;
	lastName: string;
	phoneNumber: string;
	country: string;
}

export default factory(function Advanced({ middleware: { icache } }) {
	const selectedItems = icache.getOrSet<Item[]>('selected', []);

	return (
		<div>
			<Grid
				height={500}
				pagination={true}
				onRowSelect={(items) => {
					icache.set('selected', items);
				}}
				fetcher={fetcher}
				updater={updater}
				columnConfig={columnConfig}
			/>
			<div styles={{ height: '500px', overflow: 'auto' }}>
				<h1>Selected Items</h1>
				{selectedItems.map((items) => {
					return (
						<div styles={{ margin: '5px', padding: '10px', border: '1px solid grey' }}>
							<TextInput
								label="First Name"
								readOnly={true}
								initialValue={items.firstName}
							/>
							<TextInput
								label="Last Name"
								readOnly={true}
								initialValue={items.lastName}
							/>
							<TextInput
								label="Phone"
								readOnly={true}
								initialValue={items.phoneNumber}
							/>
							<TextInput
								label="Country"
								readOnly={true}
								initialValue={items.country}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
});
