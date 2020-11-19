import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { data, Data } from '../../data';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const template = createMemoryResourceTemplate<Data>();

const dataWithDisabled = data.map((item) => ({ ...item, disabled: Math.random() < 0.1 }));

export default factory(function Basic({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Typeahead
				resource={resource({
					template,
					transform: { value: 'id', label: 'summary' },
					initOptions: { data: dataWithDisabled, id }
				})}
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
