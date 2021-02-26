import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import { data, Data } from '../../data';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ resource });

const template = createResourceTemplate<Data>('id');

export default factory(function Bottom({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({
					template: template({ id, data }),
					transform: { value: 'id', label: 'summary' }
				})}
				placement="bottom"
			>
				{{
					label: 'Select Products'
				}}
			</ChipTypeahead>
		</Example>
	);
});
