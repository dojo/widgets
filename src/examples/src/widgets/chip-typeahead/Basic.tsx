import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '@dojo/widgets/examples/src/widgets/list/states';

const factory = create();

const resource = createMemoryResourceWithDataAndFilter(states);

export default factory(function Basic() {
	return (
		<virtual>
			<ChipTypeahead resource={resource} transform={defaultTransform}>
				{{
					label: 'Select All States That Apply'
				}}
			</ChipTypeahead>
		</virtual>
	);
});
