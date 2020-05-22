import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '@dojo/widgets/examples/src/widgets/list/states';
import Example from '../../Example';
import { createMemoryResourceTemplate, createResourceMiddleware } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ resource });

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Bottom({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({ template, initOptions: { id, data: states } })}
				placement="bottom"
			>
				{{
					label: 'Select Applicable States'
				}}
			</ChipTypeahead>
		</Example>
	);
});
