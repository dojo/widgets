import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';
import { ListItem } from '@dojo/widgets/list';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

const template = createMemoryResourceTemplate<{ value: string }>();

export default factory(function CustomRenderer({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Select
				resource={resource({
					template,
					transform: { value: 'value', label: 'value' },
					initOptions: { id, data: options }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				{{
					label: 'Custom Renderer',
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
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
