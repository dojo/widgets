import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from './memoryTemplate';

const factory = create({ icache });

const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true },
	{ value: 'Print' },
	{ value: 'Export' },
	{ value: 'Share' }
];

const memoryTemplate = createMemoryTemplate();

export default factory(function Menu({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				menu
				resource={{
					resource: () => createResource(memoryTemplate),
					data: options
				}}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
