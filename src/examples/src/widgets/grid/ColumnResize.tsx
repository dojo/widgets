import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { ColumnConfig } from '@dojo/widgets/grid/interfaces';
import { createFetcher } from '@dojo/widgets/grid/utils';

import { createData } from './data';
import Example from '../../Example';

const columnConfig: ColumnConfig[] = [
	{
		id: 'id',
		title: 'ID',
		resizable: true
	},
	{
		id: 'firstName',
		title: 'First Name',
		resizable: true
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
		title: 'Other Name',
		resizable: true
	}
];

const fetcher = createFetcher(createData());
const factory = create();

export default factory(function ColumnResize() {
	return (
		<Example>
			<Grid fetcher={fetcher} columnConfig={columnConfig} height={450} />
		</Example>
	);
});
