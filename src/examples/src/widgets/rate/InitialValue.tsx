import Rate from '@dojo/widgets/rate';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;
	icache.getOrSet('initial', 4);

	return (
		<virtual>
			<Rate
				name="initial"
				initialValue={4}
				onValue={(value) => {
					set('initial', value);
				}}
			/>
			<pre>{`${get('initial')}`}</pre>
		</virtual>
	);
});

export default App;
