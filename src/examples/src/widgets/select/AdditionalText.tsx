import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from '../list/memoryTemplate';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const resource = createMemoryResourceWithData(options);

export default factory(function AdditionalText({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				label="Additional Text"
				resource={resource}
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
