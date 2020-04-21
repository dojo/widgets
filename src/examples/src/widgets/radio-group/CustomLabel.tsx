import RadioGroup from '@dojo/widgets/radio-group';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<Example>
			<RadioGroup
				name="colours"
				options={[
					{ value: 'red', label: 'Rouge' },
					{ value: 'green', label: 'Vert' },
					{ value: 'blue', label: 'Bleu' }
				]}
				onValue={(value) => {
					set('colours', value);
				}}
			>
				{{
					label: 'colours'
				}}
			</RadioGroup>
			<pre>{`${get('colours')}`}</pre>
		</Example>
	);
});

export default App;
