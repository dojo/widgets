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
	{ value: '2', label: 'Dog', disabled: true },
	{ value: '3', label: 'Fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Basic({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Typeahead
				resource={resource({ template, initOptions: { data: options, id } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Typeahead'
				}}
			</Typeahead>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
