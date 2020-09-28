import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/resource-grid';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();

const columns = [
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

interface DataType {
	id: string;
	firstName: string;
	lastName: string;
}

const total = 9999;
let data: DataType[] = [];
for (let i = 0; i < total; i++) {
	data.push({
		id: `${i}`,
		firstName: `firstName-${i}`,
		lastName: `lastName-${i}`
	});
}

const template = createMemoryResourceTemplate<DataType>();

const factory = create({ resource });

export default factory(function Basic({ id, middleware: { resource } }) {
	return (
		<Example>
			<div styles={{ height: '300px', overflow: 'hidden' }}>
				<Grid
					resource={resource({ template, initOptions: { id, data } })}
					columns={columns}
				/>
			</div>
		</Example>
	);
});
