import { create, tsx } from '@dojo/framework/core/vdom';
import Menu from '@dojo/widgets/menu';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ListBox({ middleware: { icache } }) {
	return (
		<virtual>
			<Menu
				listBox
				options={states}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemsInView={8}
				total={states.length}
			/>
			<p>{`Selected: ${icache.getOrSet('value', '')}`}</p>
		</virtual>
	);
});
