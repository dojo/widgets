import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryTemplate } from '../../../../list/tests/memoryTemplate';
import { createResource } from '@dojo/framework/core/resource';

const factory = create({ icache });
const memoryTemplate = createMemoryTemplate();

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				resource={{
					resource: () => createResource(memoryTemplate),
					data: states
				}}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
			>
				{({ value }) => {
					const color = value.length > 7 ? 'red' : 'blue';
					return <div styles={{ color: color }}>{value}</div>;
				}}
			</List>
			<p>{`Clicked On: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
