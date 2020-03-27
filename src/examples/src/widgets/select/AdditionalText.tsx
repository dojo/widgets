import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from '../list/memoryTemplate';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const memoryTemplate = createMemoryTemplate();

export default factory(function AdditionalText({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				label="Additional Text"
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				helperText="I am the helper text"
				placeholder="I am a placeholder"
			/>
			<pre>{`Value: ${icache.getOrSet('value', '')}`}</pre>
		</virtual>
	);
});
