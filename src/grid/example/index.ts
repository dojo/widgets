import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { ProjectorMixin } from '@dojo/framework/widget-core/mixins/Projector';
import { v, w } from '@dojo/framework/widget-core/d';
import Grid from '../../grid/index';
import { createFetcher } from '../../grid/utils';
import mockData from './mockData';

export class App extends WidgetBase {
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
			editable: true
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
				fetcher: createFetcher(this.gridData)
			})
		]);
	}
}

const Projector = ProjectorMixin(App);
const projector = new Projector();

projector.append();
