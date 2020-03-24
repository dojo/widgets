import { create, tsx } from '@dojo/framework/core/vdom';
import List from '@dojo/widgets/list';
import states from './states';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Menu({ middleware: { icache } }) {
	return (
		<virtual>
			<List
				menu
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
