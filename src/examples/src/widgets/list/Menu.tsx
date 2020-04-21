import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from './memoryTemplate';
import Example from '../../Example';

const factory = create({ icache });

const options = [
	{ value: 'Save' },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true },
	{ value: 'Print' },
	{ value: 'Export' },
	{ value: 'Share' }
];

const resource = createMemoryResourceWithData(options);

export default factory(function Menu({ middleware: { icache } }) {
	return (
		<Example>
			<List
				menu
				resource={resource}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>
		</Example>
	);
});
