import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

interface Animal {
	value: string;
}

const animals = [{ value: 'cat' }, { value: 'dog' }, { value: 'mouse' }, { value: 'rat' }];
const template = createResourceTemplate<Animal>('value');

export default factory(function Disabled({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				resource={resource({
					template: template({ id, data: animals }),
					transform: { value: 'value', label: 'value' }
				})}
				onValue={(value) => {
					icache.set('value', value);
				}}
				disabled={(item) => item.value === 'mouse'}
			/>
		</Example>
	);
});
