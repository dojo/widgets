import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ resource });
const options = [
	{ value: '1', label: 'Cat' },
	{ value: '2', label: 'Dog' },
	{ value: '3', label: 'Fish' }
];

const template = createResourceTemplate<ListOption>('value');

export default factory(function Disabled({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({ template: template({ id, data: options }) })}
				disabled
				initialValue={['1', '2']}
			>
				{{
					label: 'Disabled'
				}}
			</ChipTypeahead>
		</Example>
	);
});
