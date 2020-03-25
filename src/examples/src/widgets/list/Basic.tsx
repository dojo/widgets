import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from './memoryTemplate';

const factory = create({ icache });

// const animals = [
// 	{ value: 'cat' },
// 	{ value: 'dog' },
// 	{ value: 'mouse' },
// 	{ value: 'rat' }
// ];

const animals = [
	{ value: 'Alabama' },
	{ value: 'Alaska aba' },
	{ value: 'Arizona ajaja' },
	{ value: 'Arkansas' },
	{ value: 'California' },
	{ value: 'Colorado' },
	{ value: 'Connecticut' },
	{ value: 'Delaware' },
	{ value: 'Florida' },
	{ value: 'Georgia' },
	{ value: 'Hawaii jdjd' },
	{ value: 'Idaho' },
	{ value: 'Illinois' },
	{ value: 'Indiana' },
	{ value: 'Iowa' },
	{ value: 'Kansas' },
	{ value: 'Kentucky' },
	{ value: 'Louisiana' },
	{ value: 'bub bub' },
	{ value: 'bub bubs' },
	{ value: 'Maine' },
	{ value: 'Maryland' },
	{ value: 'Massachusetts' },
	{ value: 'Michigan' },
	{ value: 'Minnesota' },
	{ value: 'Mississippi' },
	{ value: 'Missouri' },
	{ value: 'Montana' },
	{ value: 'Nebraska' },
	{ value: 'Nevada' }
];

const memoryTemplate = createMemoryTemplate();

export default factory(function Basic({ middleware: { icache } }) {
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
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>{' '}
		</virtual>
	);
});
