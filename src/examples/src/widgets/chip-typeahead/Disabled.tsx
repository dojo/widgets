import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';

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
			<ChipTypeahead
				resource={resource}
				transform={defaultTransform}
				disabled
				initialValue={['cat', 'dog']}
			>
				{{
					label: 'Disabled'
				}}
			</ChipTypeahead>
		</virtual>
	);
});
