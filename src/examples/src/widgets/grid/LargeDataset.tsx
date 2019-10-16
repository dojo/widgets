import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { createFetcher } from '@dojo/widgets/grid/utils';
import { createData } from './data';

const columnConfig = [
	{
		id: 'id',
		title: 'ID'
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

const fetcher = createFetcher(createData());
const factory = create();
export default factory(() => {
	return <Grid fetcher={fetcher} columnConfig={columnConfig} height={450} />;
});
