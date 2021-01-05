import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { data, Data } from '../../data';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const template = createMemoryResourceTemplate<Data>();

export default factory(function Basic({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Select
				itemsInView={4}
				resource={resource({
					template,
					transform: { value: 'id', label: 'summary' },
					initOptions: { id, data }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Select'
				}}
			</Select>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
