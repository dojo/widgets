import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<Rate
				name="max"
				max={10}
				onValue={(value) => {
					set('max', value);
				}}
			/>
			<pre>{`${get('max')}`}</pre>
		</virtual>
	);
});

export default App;
