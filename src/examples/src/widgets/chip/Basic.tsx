import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Example from '../../Example';

const factory = create();

const App = factory(function Basic() {
	return (
		<Example>
			<Chip>{{ label: 'Chip Example' }}</Chip>
		</Example>
	);
});

export default App;
