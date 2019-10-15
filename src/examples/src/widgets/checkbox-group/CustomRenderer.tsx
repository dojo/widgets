import { create, tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '@dojo/widgets/checkbox-group/index';
import { Checkbox } from '@dojo/widgets/checkbox/index';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<CheckboxGroup
				label="going?"
				name="custom"
				options={[{ value: 'yes' }, { value: 'no' }, { value: 'maybe' }]}
				onValue={(value) => {
					set('custom', value);
				}}
				renderer={(name, checkboxGroup, options) => {
					return options.map(({ value, label }) => {
						const { checked } = checkboxGroup(value);
						return (
							<virtual>
								<span>I'm custom!</span>
								<Checkbox
									name={name}
									value={value}
									label={label || value}
									checked={checked()}
									onValue={checked}
								/>
								<hr />
							</virtual>
						);
					});
				}}
			/>
			<pre>{`${get('custom')}`}</pre>
		</virtual>
	);
});

export default App;
