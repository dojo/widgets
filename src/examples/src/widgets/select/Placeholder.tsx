import icache from '@dojo/framework/core/middleware/icache';
import {
	createResourceMiddleware,
	createResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import { create, tsx } from '@dojo/framework/core/vdom';
import { ListOption } from '@dojo/widgets/list';
import Select from '@dojo/widgets/select';
import Example from '../../Example';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });
const options = [
	{ value: '1', label: 'cat' },
	{ value: '2', label: 'dog' },
	{ value: '3', label: 'fish' }
];

const template = createResourceTemplate<ListOption>('value');

export default factory(function Placeholder({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<Select
				resource={resource({ template: template({ id, data: options }) })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				placeholder={{
					value: 'placeholder',
					label: 'I am a placeholder'
				}}
			>
				{{
					label: 'Additional Text'
				}}
			</Select>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
