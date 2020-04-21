import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from '../list/memoryTemplate';
import Example from '../../Example';

const factory = create({ icache });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const resource = createMemoryResourceWithData(options);

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<Example>
			<Select
				resource={resource}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				value={icache.get('value')}
			>
				{{
					label: 'Basic Select'
				}}
			</Select>
			<pre>{icache.getOrSet('value', '')}</pre>
		</Example>
	);
});
