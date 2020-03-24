import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource, DataTemplate } from '@dojo/framework/core/resource';

const factory = create({ icache });

const animals = [
	{ name: 'cat', label: 'cat: feline' },
	{ name: 'dog', label: 'dog: kanine', disabled: true },
	{ name: 'mouse', label: 'mouse: rodent' },
	{ name: 'rat', label: 'rat: rodent' }
];

export function createMemoryTemplate<S = void>(): DataTemplate<S> {
	return {
		read: ({ query }, put, get) => {
			let data: any[] = get();
			put(0, data);
			return { data, total: data.length };
		}
	};
}

const memoryTemplate = createMemoryTemplate();

export default factory(function MemoryResource({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				resource={{
					resource: () => createResource(memoryTemplate),
					data: animals
				}}
				transform={defaultTransform}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
