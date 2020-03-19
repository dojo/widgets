import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
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
			</Menu>
			<p>{`Clicked On: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
