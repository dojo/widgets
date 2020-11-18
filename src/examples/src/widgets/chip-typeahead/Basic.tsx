import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import { data, Data } from '../../data';
import Example from '../../Example';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ resource });

const template = createMemoryResourceTemplate<Data>();

export default factory(function Basic({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({
					template,
					transform: { value: 'id', label: 'product' },
					initOptions: { id, data }
				})}
			>
				{{
					label: 'Select Products'
				}}
			</ChipTypeahead>
		</Example>
	);
});
