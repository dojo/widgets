import { create, tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '@dojo/widgets/checkbox-group';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<Example>
			<CheckboxGroup
				value={get('controlled')}
				name="initial-value"
				options={[{ value: 'tom' }, { value: 'dick' }, { value: 'harry' }]}
				onValue={(value) => {
					set('controlled', value);
				}}
			>
				{{
					label: 'favourite names'
				}}
			</CheckboxGroup>
			<pre>{`${get('controlled')}`}</pre>
		</Example>
	);
});

export default App;
