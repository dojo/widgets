import { create, tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '@dojo/widgets/checkbox-group';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	return (
		<Example>
			<CheckboxGroup
				name="standard"
				options={[{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }]}
				onValue={(value) => {
					icache.set('standard', value);
				}}
			>
				{{
					label: 'pets'
				}}
			</CheckboxGroup>
			<pre>{`${icache.get('standard')}`}</pre>
		</Example>
	);
});

export default App;
