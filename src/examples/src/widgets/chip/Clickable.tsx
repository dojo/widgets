import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ middleware: { icache } }) {
	const clickable = icache.getOrSet<number>('clickable', 0);
	return (
		<virtual>
			<Chip
				label="Clickable"
				onClick={() => {
					icache.set('clickable', icache.getOrSet<number>('clickable', 0) + 1);
				}}
			/>
			<div>Clicked {String(clickable)} times</div>
		</virtual>
	);
});

export default App;
