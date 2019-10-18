import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Icon from '@dojo/widgets/icon';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ middleware: { icache } }) {
	const checked = icache.get<boolean>('checked');
	return (
		<virtual>
			<Chip
				label="Click to toggle"
				checked={checked}
				onClick={() => {
					icache.set('checked', !icache.get<boolean>('checked'));
				}}
				iconRenderer={(checked) => <Icon type={checked ? 'plusIcon' : 'minusIcon'} />}
			/>
		</virtual>
	);
});

export default App;
