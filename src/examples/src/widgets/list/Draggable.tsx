import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const animals = [
	{ value: 'cat' },
	{ value: 'dog' },
	{ value: 'mouse' },
	{ value: 'rat' },
	{ value: 'cat' },
	{ value: 'dog' },
	{ value: 'mouse' },
	{ value: 'rat' },
	{ value: 'cat' },
	{ value: 'dog' },
	{ value: 'mouse' },
	{ value: 'rat' }
];
const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Draggable({ id, middleware: { icache, resource } }) {
	const animalData = icache.getOrSet('animalData', animals);
	const data = resource({ template, initOptions: { id, data: animalData } });

	return (
		<Example>
			<List
				draggable
				onMove={(from, to) => {
					const sortable = [...animalData];
					const item = sortable[from];
					sortable.splice(from, 1);
					sortable.splice(to, 0, item);
					icache.set('animalData', sortable);
				}}
				resource={data}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
