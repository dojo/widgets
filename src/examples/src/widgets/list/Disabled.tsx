import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from './memoryTemplate';
import Example from '../../Example';

const factory = create({ icache });

const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const resource = createMemoryResourceWithData(animals);

export default factory(function Disabled({ middleware: { icache } }) {
	return (
		<Example>
			<List
				resource={resource}
				transform={defaultTransform}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				disabled={(item) => item.value === 'mouse'}
			/>
		</Example>
	);
});
