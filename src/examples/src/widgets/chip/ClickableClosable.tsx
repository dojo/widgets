import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ middleware: { icache } }) {
	const clickableClosed = icache.get<boolean>('clickableClosed');
	const clickableClosedCount = icache.getOrSet<number>('clickableClosedCount', 0);

	return (
		<virtual>
			{!clickableClosed && (
				<Chip
					label="Click or close"
					onClick={() => {
						icache.set(
							'clickableClosedCount',
							icache.getOrSet<number>('clickableClosedCount', 0) + 1
						);
					}}
					onClose={() => {
						icache.set('clickableClosed', true);
					}}
				/>
			)}
			<div>Clicked {String(clickableClosedCount)} times</div>
		</virtual>
	);
});

export default App;
