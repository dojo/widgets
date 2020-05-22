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
	{ value: 'Save' },
	{ value: 'Delete', divider: true },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true, divider: true },
	{ value: 'Edit' }
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
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
