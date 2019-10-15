import { create, tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '@dojo/widgets/checkbox-group/index';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<CheckboxGroup
				label="pets"
				name="standard"
				options={[{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }]}
				onValue={(value) => {
					set('standard', value);
				}}
			/>
			<pre>{`${get('standard')}`}</pre>
		</virtual>
	);
});

export default App;
