import { create, tsx } from '@dojo/framework/core/vdom';
import { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithDataAndFilter } from '../list/memoryTemplate';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '@dojo/widgets/examples/src/widgets/list/states';
import Example from '../../Example';

const factory = create();

const resource = createMemoryResourceWithDataAndFilter(states);

export default factory(function Bottom() {
	return (
		<Example>
			<ChipTypeahead resource={resource} transform={defaultTransform} placement="bottom">
				{{
					label: 'Select Applicable States'
				}}
			</ChipTypeahead>
		</Example>
	);
});
