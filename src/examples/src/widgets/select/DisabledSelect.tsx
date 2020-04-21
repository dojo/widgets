import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from '../list/memoryTemplate';
import Example from '../../Example';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const memoryTemplate = createMemoryTemplate();

export default factory(function DisabledSelect() {
	return (
		<Example>
			<Select
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				disabled
				onValue={() => {}}
			>
				{{
					label: 'Disabled Select'
				}}
			</Select>
		</Example>
	);
});
