import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function Closeable({ middleware: { icache } }) {
	const closed = icache.get<boolean>('closed');

	return (
		<Example>
			{!closed && (
				<Chip
					onClose={() => {
						icache.set('closed', true);
					}}
				>
					{{
						label: 'Close me'
					}}
				</Chip>
			)}
		</Example>
	);
});

export default App;
