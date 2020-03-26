import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from '../../../../list/tests/memoryTemplate';

const factory = create({ icache });

const animals = [
	{ name: 'whiskers', type: 'feline' },
	{ name: 'fido', type: 'kanine' },
	{ name: 'mickey', type: 'rodent' }
];

const memoryTemplate = createMemoryTemplate();

export default factory(function CustomTransformer({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				resource={{
					resource: () => createResource(memoryTemplate),
					data: animals
				}}
				transform={{
					value: ['type'],
					label: ['name']
				}}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
