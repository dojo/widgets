import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: '1', label: 'Save' },
	{ value: '2', label: 'Delete', divider: true },
	{ value: '3', label: 'Copy' },
	{ value: '4', label: 'Paste', disabled: true, divider: true },
	{ value: '5', label: 'Edit' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Dividers({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				resource={resource({ template, initOptions: { id, data: options } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
