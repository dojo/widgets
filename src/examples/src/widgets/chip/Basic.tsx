import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';

const factory = create();

const App = factory(function Basic() {
	return <Chip label="Chip Example" />;
});

export default App;
