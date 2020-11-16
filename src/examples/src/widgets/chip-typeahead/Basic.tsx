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

const template = createMemoryResourceTemplate<{ value: string; disabled?: boolean }>();

export default factory(function Basic({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({
					template,
					transform: { value: 'value', label: 'value' },
					initOptions: { id, data: states }
				})}
			>
				{{
					label: 'Select All States That Apply'
				}}
			</ChipTypeahead>
		</Example>
	);
});
