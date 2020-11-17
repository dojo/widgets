import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
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

export default factory(function Validation({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Typeahead
				resource={resource({ template, initOptions: { id, data: options } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				required
			>
				{{
					label: 'Validation'
				}}
			</Typeahead>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
