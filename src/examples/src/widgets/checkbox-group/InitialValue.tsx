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
				initialValue={['tom']}
				name="initial-value"
				options={[{ value: 'tom' }, { value: 'dick' }, { value: 'harry' }]}
				onValue={(value) => {
					set('initial-value', value);
				}}
			>
				{{
					label: 'favourite names'
				}}
			</CheckboxGroup>
			<pre>{`${get('initial-value')}`}</pre>
		</Example>
	);
});

export default App;
