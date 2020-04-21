import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function ClickableClosable({ middleware: { icache } }) {
	const clickableClosed = icache.get<boolean>('clickableClosed');
	const clickableClosedCount = icache.getOrSet<number>('clickableClosedCount', 0);

	return (
		<Example>
			{!clickableClosed && (
				<Chip
					onClick={() => {
						icache.set(
							'clickableClosedCount',
							icache.getOrSet<number>('clickableClosedCount', 0) + 1
						);
					}}
					onClose={() => {
						icache.set('clickableClosed', true);
					}}
				>
					{{ label: 'Click or close' }}
				</Chip>
			)}
			<div>Clicked {String(clickableClosedCount)} times</div>
		</Example>
	);
});

export default App;
