import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

interface Animal {
	value: string;
}

const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const template = createMemoryResourceTemplate<Animal>();

export default factory(function Disabled({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				resource={resource({
					template,
					transform: { value: 'value', label: 'value' },
					initOptions: { id, data: animals }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
				disabled={(item) => item.value === 'mouse'}
			/>
		</Example>
	);
});
