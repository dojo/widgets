import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import { ListOption } from '@dojo/widgets/list';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: '1', label: 'cat' },
	{ value: '2', label: 'dog' },
	{ value: '3', label: 'fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function DisabledSelect({ id, middleware: { resource } }) {
	return (
		<Example>
			<Select
				resource={resource({ template, initOptions: { id, data: options } })}
				disabled
				onValue={() => {}}
			>
				{{
					label: 'Disabled Select'
				}}
			</Select>
		</Example>
	);
});
