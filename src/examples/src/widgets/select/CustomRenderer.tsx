import { create, tsx } from '@dojo/framework/core/vdom';
import Select, { defaultTransform } from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from '../list/memoryTemplate';
import { ListItem } from '@dojo/widgets/list';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];
const memoryTemplate = createMemoryTemplate();

export default factory(function CustomRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Basic Select',
					items: ({ selected, value }, props) => {
						return (
							<ListItem {...props}>
								{selected && <span>✅ </span>}
								{value}
							</ListItem>
						);
					}
				}}
			</Select>
			<pre>{icache.getOrSet('value', '')}</pre>
		</virtual>
	);
});
