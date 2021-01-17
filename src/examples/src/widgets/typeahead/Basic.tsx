import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Typeahead from '@dojo/widgets/typeahead';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { data, Data } from '../../data';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const template = createResourceTemplate<Data>('id');

const dataWithDisabled = data.map((item) => ({ ...item, disabled: Math.random() < 0.1 }));

export default factory(function Basic({ id, middleware: { icache, resource } }) {
	const strict = icache.getOrSet('strict', true);
	return (
		<Example>
			<Typeahead
				strict={strict}
				resource={resource({
					template: template({ data: dataWithDisabled, id }),
					transform: { value: 'id', label: 'product' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Typeahead'
				}}
			</Typeahead>
			<button onclick={() => icache.set('strict', (strict = true) => !strict)}>
				{strict ? 'Non strict' : 'strict'}
			</button>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
