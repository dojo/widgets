import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';

const factory = create();

const App = factory(function Disabled() {
	return (
		<Chip
			label="Disabled"
			disabled
			onClick={() => {
				window.alert('clicked');
			}}
		/>
	);
});

export default App;
