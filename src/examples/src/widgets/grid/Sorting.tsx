import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { ColumnConfig } from '@dojo/widgets/grid/interfaces';
import { createFetcher } from '@dojo/widgets/grid/utils';

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
		sortable: true
	},
	{
		id: 'lastName',
		title: 'Last Name',
		sortable: true
	}
];

const fetcher = createFetcher(createData());
const factory = create();

export default factory(() => {
	return (
		<Example>
			<Grid fetcher={fetcher} columnConfig={columnConfig} height={450} />
		</Example>
	);
});
