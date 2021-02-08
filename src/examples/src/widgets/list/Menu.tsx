import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import {
	createResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const options = [
	{ value: '1', label: 'Save' },
	{ value: '2', label: 'Copy' },
	{ value: '3', label: 'Paste', disabled: true },
	{ value: '4', label: 'Print' },
	{ value: '5', label: 'Export' },
	{ value: '6', label: 'Share' }
];

const template = createResourceTemplate<ListOption>('value');

export default factory(function Menu({ id, middleware: { icache, resource } }) {
	return (
		<Example>
			<List
				menu
				resource={resource({ template: template({ id, data: options }) })}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			/>
			<p>{`Selected: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
