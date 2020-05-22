import { create, tsx } from '@dojo/framework/core/vdom';
import ChipTypeahead from '@dojo/widgets/chip-typeahead';
import Example from '../../Example';
import { createMemoryResourceTemplate, createResourceMiddleware } from '@dojo/widgets/resources';
import { ListOption } from '@dojo/widgets/list';

const resource = createResourceMiddleware();
const factory = create({ resource });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Disabled({ id, middleware: { resource } }) {
	return (
		<Example>
			<ChipTypeahead
				resource={resource({ template, initOptions: { id, data: options } })}
				disabled
				initialValue={['cat', 'dog']}
			>
				{{
					label: 'Disabled'
				}}
			</ChipTypeahead>
		</Example>
	);
});
