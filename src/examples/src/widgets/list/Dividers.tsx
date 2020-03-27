import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from './memoryTemplate';

const factory = create({ icache });
const options = [
	{ value: 'Save' },
	{ value: 'Delete', divider: true },
	{ value: 'copy', label: 'Copy' },
	{ value: 'Paste', disabled: true, divider: true },
	{ value: 'Edit' }
];
const resource = createMemoryResourceWithData(options);

export default factory(function Dividers({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				resource={resource}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
