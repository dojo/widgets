import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import Example from '../../Example';
import { createMemoryResourceTemplate, createResourceMiddleware } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function FreeText({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Typeahead
				strict={false}
				resource={resource({ template, initOptions: { id, data: options } })}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Typeahead'
				}}
			</Typeahead>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
