import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';

const factory = create();

const App = factory(function Disabled() {
	return (
		<Chip
			disabled
			onClick={() => {
				window.alert('clicked');
			}}
		>
			{{ label: 'Disabled' }}
		</Chip>
	);
});

export default App;
