import { tsx, create } from '@dojo/framework/core/vdom';
import Grid from '@dojo/widgets/grid';
import { ColumnConfig, FetcherOptions } from '@dojo/widgets/grid/interfaces';
import { createFetcherResult, sorter } from '@dojo/widgets/grid/utils';

import { createData } from './data';
import * as css from './CustomFilterRenderer.m.css';

import Button from '@dojo/widgets/button';
import TextInput from '@dojo/widgets/text-input';

const columnConfig: ColumnConfig[] = [
	{
		id: 'id',
		title: 'ID'
	},
	{
		id: 'gender',
		title: 'Gender',
		filterable: true
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

const data = createData();

function filterer(data: any[], { filter }: FetcherOptions) {
	if (filter) {
		return data.filter((item) => {
			let match = true;
			Object.keys(filter).forEach((columnId) => {
				if (columnId === 'gender') {
					match = !filter[columnId] || item[columnId] === filter[columnId];
				} else if (
					item[columnId].toLowerCase().indexOf(filter[columnId].toLowerCase()) === -1
				) {
					match = false;
				}
			});
			return match;
		});
	}
	return [...data];
}

async function fetcher(page: number, pageSize: number, options: FetcherOptions = {}) {
	return createFetcherResult(sorter(filterer(data, options), options), page, pageSize);
}

const factory = create();

export default factory(function CustomFilterRenderer() {
	return (
		<Grid
			fetcher={fetcher}
			columnConfig={columnConfig}
			height={450}
			customRenderers={{
				filterRenderer: (columnConfig: ColumnConfig, filterValue, doFilter, title) => {
					if (columnConfig.id === 'gender') {
						return (
							<div>
								<Button
									classes={{ '@dojo/widgets/button': { root: [css.filter] } }}
									pressed={filterValue === 'female'}
									onClick={() => {
										if (filterValue === 'female') {
											doFilter('');
										} else {
											doFilter('female');
										}
									}}
								>
									Female
								</Button>
								<Button
									classes={{ '@dojo/widgets/button': { root: [css.filter] } }}
									pressed={filterValue === 'male'}
									onClick={() => {
										if (filterValue === 'male') {
											doFilter('');
										} else {
											doFilter('male');
										}
									}}
								>
									Male
								</Button>
							</div>
						);
					}
					return (
						<TextInput
							key="filter"
							label={`Filter by ${title}`}
							labelHidden={true}
							type="search"
							initialValue={filterValue}
							onValue={doFilter}
						/>
					);
				}
			}}
		/>
	);
});
