import RadioGroup from '@dojo/widgets/radio-group';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	return (
		<Example>
			<RadioGroup
				name="standard"
				value={icache.get('standard')}
				options={[{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }]}
				onValue={(value) => {
					icache.set('standard', value);
				}}
			>
				{{
					label: 'pets'
				}}
			</RadioGroup>
			<pre>{`${icache.get('standard')}`}</pre>
		</Example>
	);
});

export default App;
