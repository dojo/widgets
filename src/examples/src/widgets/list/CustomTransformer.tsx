import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from './memoryTemplate';

const factory = create({ icache });

const animals = [
	{ name: 'whiskers', type: 'feline' },
	{ name: 'fido', type: 'kanine' },
	{ name: 'mickey', type: 'rodent' }
];

const resource = createMemoryResourceWithData(animals);

export default factory(function CustomTransformer({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				resource={resource}
				transform={{
					value: ['type'],
					label: ['name']
				}}
				onValue={(value: string) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
