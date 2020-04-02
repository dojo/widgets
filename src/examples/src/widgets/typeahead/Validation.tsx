import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import Typeahead from '@dojo/widgets/typeahead';

const factory = create({ icache });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const resource = createMemoryResourceWithDataAndFilter(options);

export default factory(function Validation({ middleware: { icache } }) {
	return (
		<virtual>
			<Typeahead
				label="Validation"
				resource={resource}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				required
			/>
			<pre>{icache.getOrSet('value', '')}</pre>
		</virtual>
	);
});
