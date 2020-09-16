import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/resource-grid';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();

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

const data = [
	{ id: 1, firstName: 'Bob', lastName: 'Hope' },
	{ id: 2, firstName: 'Bobby', lastName: 'Hopes' },
	{ id: 3, firstName: 'Robert', lastName: 'Hope' },
	{ id: 4, firstName: 'Rob', lastName: 'Hopey' },
	{ id: 5, firstName: 'Robby', lastName: 'Hoped' }
];

const template = createMemoryResourceTemplate<any>();

const factory = create({ resource });

export default factory(function Basic({ id, middleware: { resource } }) {
	return (
		<Example>
			<Grid
				resource={resource({ template, initOptions: { id, data } })}
				columnConfig={columnConfig}
			/>
		</Example>
	);
});
