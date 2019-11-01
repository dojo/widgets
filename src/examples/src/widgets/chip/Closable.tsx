import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function Closeable({ middleware: { icache } }) {
	const { get, set } = icache;
	const closed = get<boolean>('closed');

	return (
		<virtual>
			{!closed && (
				<Chip
					label="Close me"
					onClose={() => {
						set('closed', true);
					}}
				/>
			)}
		</virtual>
	);
});

export default App;
