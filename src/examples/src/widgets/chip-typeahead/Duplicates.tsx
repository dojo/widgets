import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';

const factory = create();
const options = [
	{ value: 'cheese', label: 'Cheese 🧀' },
	{ value: 'pineapple', label: 'Pineapple 🍍' },
	{ value: 'pepperoni', label: 'Pepperoni 🍕' },
	{ value: 'onions', label: 'Onions 🧅' }
];

const resource = createMemoryResourceWithDataAndFilter(options);

export default factory(function Duplicates() {
	return (
		<Example>
			<ChipTypeahead resource={resource} transform={defaultTransform} duplicates>
				{{
					label: 'Select Pizza Toppings'
				}}
			</ChipTypeahead>
		</Example>
	);
});
