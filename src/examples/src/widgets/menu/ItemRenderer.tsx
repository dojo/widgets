import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu/Menu';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ItemRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
				options={states}
				initialValue={'cat'}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemRenderer={({ value }) => {
					const color = value.length > 7 ? 'red' : 'blue';
					return <div styles={{ color: color }}>{value}</div>;
				}}
				itemsInView={8}
			/>
			<p>{`Selected: ${icache.getOrSet<string>('value', '')}`}</p>
		</virtual>
	);
});
