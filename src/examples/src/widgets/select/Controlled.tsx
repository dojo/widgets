import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware,
	defaultFind
} from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: '1', label: 'Cat' },
	{ value: '2', label: 'Dog' },
	{ value: '3', label: 'Fish' }
];

const template = createResourceTemplate<{ value: string; label: string }>({
	find: defaultFind,
	read: async (req, { put }) => {
		put({ data: options, total: options.length }, req);
	}
});

export default factory(function Controlled({ middleware: { icache, resource } }) {
	const currentValue = icache.get<ListOption>('value');
	return (
		<Example>
			<Select
				resource={resource({ template })}
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
