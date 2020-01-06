import RadioGroup from '@dojo/widgets/radio-group';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<RadioGroup
				initialValue="tom"
				label="favourite names"
				name="initial-value"
				options={[{ value: 'tom' }, { value: 'dick' }, { value: 'harry' }]}
				onValue={(value) => {
					set('initial-value', value);
				}}
			/>
			<pre>{`${get('initial-value')}`}</pre>
		</virtual>
	);
});

export default App;
