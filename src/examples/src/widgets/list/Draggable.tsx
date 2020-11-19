import icache from '@dojo/framework/core/middleware/icache';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';
import { create, tsx } from '@dojo/framework/core/vdom';
import List, { ListOption } from '@dojo/widgets/list';

import Example from '../../Example';

const resource = createResourceMiddleware();
const factory = create({ icache, resource });

const items = Array.from(Array(100).keys()).map((value, i) => ({
	value: `${i}`,
	label: `${value}`
}));
const template = createMemoryResourceTemplate<ListOption>();

export default factory(function Draggable({ id, middleware: { icache, resource } }) {
	const rawData = icache.getOrSet('rawData', items);
	const data = resource({ template, initOptions: { id, data: rawData } });

	return (
		<Example>
			<List
				draggable
				onMove={(from, to) => {
					const sortable = [...rawData];
					const item = sortable[from];
					sortable.splice(from, 1);
					sortable.splice(to, 0, item);
					icache.set('rawData', sortable);
				}}
				resource={data}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<p>{`Clicked on: ${JSON.stringify(icache.getOrSet('value', ''))}`}</p>
		</Example>
	);
});
