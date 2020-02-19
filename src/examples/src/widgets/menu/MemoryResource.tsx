import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource, createMemoryTemplate } from '@dojo/widgets/common/resource';

const factory = create({ icache });

const animals = [
	{ name: 'cat', type: 'feline' },
	{ name: 'dog', type: 'kanine' },
	{ name: 'mouse', type: 'rodent' },
	{ name: 'rat', type: 'rodent' }
];

const animalResource = createResource(createMemoryTemplate());

export default factory(function MemoryResource({ middleware: { icache } }) {
	// const toggled = icache.getOrSet('toggled', false);
	return (
		<virtual>
			<Menu
				resource={{ resource: animalResource, data: animals }}
				transform={{
					value: ['name'],
					label: ['name', 'type']
				}}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
				itemsInView={10}
			/>
			{/* <button
				type="button"
				onclick={(e) => {
					e.stopPropagation();
					const toggled = icache.getOrSet('toggled', false);
					icache.set('toggled', !toggled);
				}}
			>
				click to change array
			</button> */}
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
