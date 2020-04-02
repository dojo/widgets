import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Icon from '@dojo/widgets/icon';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function ClosableRenderer({ middleware: { icache } }) {
	const { get, set } = icache;
	const closed = get<boolean>('closed');

	return (
		<virtual>
			{!closed && (
				<Chip
					onClose={() => {
						set('closed', true);
					}}
				>
					{{
						label: 'Close me',
						closeIcon: <Icon type="minusIcon" />
					}}
				</Chip>
			)}
		</virtual>
	);
});

export default App;
