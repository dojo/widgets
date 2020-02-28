import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource, createTransformer } from '@dojo/widgets/common/resource';

const factory = create({ icache });

interface Animal {
	name: string;
	type: string;
	disabled?: boolean;
}

const animals: Animal[] = [
	{ name: 'cat', type: 'feline' },
	{ name: 'dog', type: 'kanine', disabled: true },
	{ name: 'mouse', type: 'rodent' },
	{ name: 'rat', type: 'rodent' }
];

const wildAnimals: Animal[] = [
	{ name: 'lion', type: 'feline' },
	{ name: 'hyena', type: 'kanine' },
	{ name: 'snake', type: 'reptile' }
];

export function createMemoryTemplate<S = void>({
	filterType = 'OR'
}: {
	filterType?: FilterType;
} = {}): DataTemplate<S> {
	return {
		read: ({ query }, put, get) => {
			let data: any[] = get();
			// if (query && Object.keys(query).length > 0) {
			// 	data = data.filter((item) => {
			// 		return Object.keys(query)[filterType === 'OR' ? 'some' : 'every']((key) => {
			// 			return item[key].indexOf(query[key]) > -1;
			// 		});
			// 	});
			// }

			put(0, data);
			return { data, total: data.length };
		}
	};
}

const memoryTemplate = createMemoryTemplate<Animal>();
const animalResourceFactory = () => {
	return createResource(memoryTemplate);
};
const menuTransformer = createTransformer(memoryTemplate, {
	value: ['name'],
	lasbel: ['name', 'type'],
	disabled: ['disabled']
});

export default factory(function MemoryResource({ middleware: { icache } }) {
	const toggled = icache.getOrSet('toggled', false);
	const disabled = icache.getOrSet('disabled', false);

	animals[2].disabled = disabled;

	return (
		<virtual>
			<Menu
				resource={{
					resource: animalResourceFactory,
					data: toggled ? wildAnimals : animals
				}}
				transform={menuTransformer}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					const toggled = icache.getOrSet('toggled', false);
					icache.set('toggled', !toggled);
				}}
			>
				click to change array
			</button>
			<button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					const disabled = icache.getOrSet('disabled', false);
					icache.set('disabled', !disabled);
				}}
			>
				click to disable an item
			</button>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
