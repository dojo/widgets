import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Example from '../../Example';

const factory = create();

const App = factory(function Disabled() {
	return (
		<Example>
			<Chip
				disabled
				onClick={() => {
					window.alert('clicked');
				}}
			>
				{{ label: 'Disabled' }}
			</Chip>
		</Example>
	);
});

export default App;
