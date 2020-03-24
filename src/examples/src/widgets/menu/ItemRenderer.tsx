import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				options={states}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
				total={states.length}
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
