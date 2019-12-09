import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { ColumnConfig } from '@dojo/widgets/grid/interfaces';
import { createFetcher } from '@dojo/widgets/grid/utils';

import { createData } from './data';

const columnConfig: ColumnConfig[] = [
	{
		id: 'id',
		title: 'ID'
	},
	{
		id: 'firstName',
		title: 'First Name'
	},
	{
		id: 'middleName',
		title: 'Middle Name'
	},
	{
		id: 'lastName',
		title: 'Last Name'
	},
	{
		id: 'otherName',
		title: 'Other Name'
	}
];

const fetcher = createFetcher(createData());
const factory = create();

export default factory(function ColumnResize() {
	return <Grid fetcher={fetcher} pagination={true} columnConfig={columnConfig} height={450} />;
});
