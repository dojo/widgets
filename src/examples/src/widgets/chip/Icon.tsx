import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';

const factory = create();

const App = factory(function() {
	return (
		<virtual>
			<Chip label="Icon Example" icon="alertIcon" />
		</virtual>
	);
});

export default App;
