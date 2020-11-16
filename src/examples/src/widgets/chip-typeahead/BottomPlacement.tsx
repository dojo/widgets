import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import states from '../list/states';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ resource });

const template = createMemoryResourceTemplate<typeof states[0]>();

export default factory(function Bottom({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({
					template,
					transform: { value: 'value', label: 'value' },
					initOptions: { id, data: states }
				})}
				placement="bottom"
			>
				{{
					label: 'Select Applicable States'
				}}
			</ChipTypeahead>
		</Example>
	);
});
