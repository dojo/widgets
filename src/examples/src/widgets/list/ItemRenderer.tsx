import { create, tsx } from '@dojo/framework/core/vdom';
import List, { defaultTransform } from '@dojo/widgets/list';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';
import { createMemoryResourceWithData } from './memoryTemplate';

const factory = create({ icache });
const resource = createMemoryResourceWithData(states);

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				resource={resource}
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
