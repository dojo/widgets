import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { ColumnConfig } from '@dojo/widgets/grid/interfaces';
import { createFetcher, createUpdater } from '@dojo/widgets/grid/utils';

import { createData } from './data';
import Example from '../../Example';

const columnConfig: ColumnConfig[] = [
	{
		id: 'id',
		title: 'ID'
	},
	{
		id: 'firstName',
		title: 'First Name',
		editable: true
	},
	{
		id: 'lastName',
		title: 'Last Name',
		editable: true
	}
];

const data = createData();
const fetcher = createFetcher(data);
const updater = createUpdater(data);
const factory = create();

export default factory(() => {
	return (
		<Example>
			<Grid updater={updater} fetcher={fetcher} columnConfig={columnConfig} height={450} />
		</Example>
	);
});
