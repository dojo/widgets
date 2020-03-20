import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

const App = factory(function() {
	return (
		<virtual>
			<Rate name="disabled" initialValue={3} readOnly />
		</virtual>
	);
});

export default App;
