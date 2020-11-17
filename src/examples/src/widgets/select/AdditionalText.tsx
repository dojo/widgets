import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: '1', label: 'cat' },
	{ value: '2', label: 'dog' },
	{ value: '3', label: 'fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function AdditionalText({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Select
				resource={resource({ template, initOptions: { id, data: options } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				helperText="I am the helper text"
				placeholder="I am a placeholder"
			>
				{{
					label: 'Additional Text'
				}}
			</Select>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
