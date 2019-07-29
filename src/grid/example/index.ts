import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { v, w } from '@dojo/framework/core/vdom';
import Grid from '../../grid/index';
import { createFetcher } from '../../grid/utils';
import mockData from './mockData';

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
			sortable: true
		},
		{
			id: 'last_name',
			title: 'Last Name',
			editable: true,
			sortable: true
		},
		{
			id: 'job',
			title: 'Job Title',
			editable: true,
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
			})
		]);
	}
}
