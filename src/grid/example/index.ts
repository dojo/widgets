import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import Grid from '../../grid/index';
import { createFetcher } from '../../grid/utils';
import mockData, { getMockData } from './mockData';

export default class App extends WidgetBase {
	private columnConfig = [
		{
			id: 'id',
			title: 'ID'
		},
		{
			id: 'first_name',
			title: 'First Name',
			editable: true,
			resizable: true,
			sortable: true
		},
		{
			id: 'last_name',
			title: 'Last Name',
			editable: true,
			resizable: true,
			sortable: true
		},
		{
			id: 'job',
			title: 'Job Title',
			editable: true,
			resizable: true,
			filterable: true
		},
		{
			id: 'gender',
			title: 'Gender',
			editable: true
		},
		{
			id: 'animal',
			title: 'Pet',
			editable: true,
			resizable: true,
			filterable: true
		}
	];

	private gridData: any[] = mockData;

	render() {
		return v('div', [
			v('h2', ['Grid Example']),
			w(Grid, {
				columnConfig: this.columnConfig,
				fetcher: createFetcher(this.gridData),
				height: 500
			}),
			v('h2', ['Paginated Grid Example']),
			w(Grid, {
				pagination: true,
				columnConfig: this.columnConfig,
				fetcher: createFetcher(getMockData(20)),
				height: 500
			})
		]);
	}
}
