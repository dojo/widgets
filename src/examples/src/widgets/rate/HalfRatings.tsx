import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<Rate
				name="half"
				steps={2}
				onValue={(value) => {
					set('half', value);
				}}
			/>
			<pre>{`${get('half')}`}</pre>
		</virtual>
	);
});

export default App;
