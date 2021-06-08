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

export default factory(function Kinds({ id, middleware: { resource } }) {
	return (
		<Example>
			<div>
				<ChipTypeahead
					resource={resource({
						template: template({ id, data }),
						transform: { value: 'id', label: 'product' }
					})}
				>
					{{
						label: 'Default Kind'
					}}
				</ChipTypeahead>
				<br />
				<br />
				<ChipTypeahead
					resource={resource({
						template: template({ id, data }),
						transform: { value: 'id', label: 'product' }
					})}
					kind="outlined"
				>
					{{
						label: 'Outlined Kind'
					}}
				</ChipTypeahead>
			</div>
		</Example>
	);
});
