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
	{ value: '1', label: 'Cat' },
	{ value: '2', label: 'Dog' },
	{ value: '3', label: 'Fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Controlled({ id, middleware: { icache, resource } }) {
	const currentValue = icache.get<ListOption>('value');
	return (
		<Example>
			<Select
				resource={resource({ template, initOptions: { id, data: options } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				value={currentValue ? currentValue.value : '1'}
			>
				{{
					label: 'Controlled Select'
				}}
			</Select>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
