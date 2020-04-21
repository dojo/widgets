import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/grid';
import { createFetcher } from '@dojo/widgets/grid/utils';
import Example from '../../Example';

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

const fetcher = createFetcher([
	{ id: 1, firstName: 'Bob', lastName: 'Hope' },
	{ id: 2, firstName: 'Bobby', lastName: 'Hope' },
	{ id: 3, firstName: 'Robert', lastName: 'Hope' },
	{ id: 4, firstName: 'Rob', lastName: 'Hope' },
	{ id: 5, firstName: 'Robby', lastName: 'Hope' }
]);

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Grid fetcher={fetcher} columnConfig={columnConfig} height={200} />
		</Example>
	);
});
