import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import MultiSelectTypeahead from '@dojo/widgets/multi-select-typeahead';

const factory = create();
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const resource = createMemoryResourceWithDataAndFilter(options);

export default factory(function Disabled() {
	return (
		<virtual>
			<MultiSelectTypeahead
				resource={resource}
				transform={defaultTransform}
				disabled
				initialValue={['cat', 'dog']}
			>
				{{
					label: 'Disabled'
				}}
			</MultiSelectTypeahead>
		</virtual>
	);
});
