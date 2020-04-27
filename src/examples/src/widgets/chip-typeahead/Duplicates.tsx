import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { createResource, createMemoryTemplate, defaultFilter } from '@dojo/framework/core/resource';

const factory = create();
const options = [
	{ value: 'cheese', label: 'Cheese 🧀' },
	{ value: 'pineapple', label: 'Pineapple 🍍' },
	{ value: 'pepperoni', label: 'Pepperoni 🍕' },
	{ value: 'onions', label: 'Onions 🧅' }
];

const resource = createResource(createMemoryTemplate({ filter: defaultFilter }));

export default factory(function Duplicates() {
	return (
		<Example>
			<ChipTypeahead resource={resource(options)} transform={defaultTransform} duplicates>
				{{
					label: 'Select Pizza Toppings'
				}}
			</ChipTypeahead>
		</Example>
	);
});
