import { tsx, create } from '@dojo/framework/core/vdom';

import Grid from '@dojo/widgets/resource-grid';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import TextInput from '@dojo/widgets/text-input';

const resource = createResourceMiddleware();

const columns = [
	{
		id: 'id',
		title: 'ID',
		sortable: true
	},
	{
		id: 'firstName',
		title: 'First Name',
		filterable: true
	},
	{
		id: 'lastName',
		title: 'Last Name',
		filterable: true
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
			<div styles={{ height: '600px', overflow: 'hidden' }}>
				<Grid
					resource={resource({ template, initOptions: { id, data } })}
					columns={columns}
				>
					{{
						firstName: {
							cell: (item: DataType, rowIndex) => {
								return `name is ${item.firstName}`;
							}
						},
						lastName: {
							header: ({ title, onFilter }) => {
								return (
									<virtual>
										<TextInput onValue={onFilter} />
										{`** ${title} **`}
									</virtual>
								);
							}
						}
					}}
				</Grid>
			</div>
		</Example>
	);
});
