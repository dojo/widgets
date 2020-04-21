import { create, tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '@dojo/widgets/checkbox-group';
import { Checkbox } from '@dojo/widgets/checkbox';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

const App = factory(function({ middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<Example>
			<CheckboxGroup
				name="custom"
				options={[{ value: 'yes' }, { value: 'no' }, { value: 'maybe' }]}
				onValue={(value) => {
					set('custom', value);
				}}
			>
				{{
					label: 'going?',
					checkboxes: (name, checkboxGroup, options) => {
						return options.map(({ value, label }) => {
							const { checked } = checkboxGroup(value);
							return (
								<virtual>
									<span>I'm custom!</span>
									<Checkbox
										name={name}
										value={value}
										checked={checked()}
										onValue={checked}
									>
										{label || value}
									</Checkbox>
									<hr
										styles={{
											borderColor: '#d6dde2',
											borderStyle: 'solid',
											borderWidth: '1px 0 0',
											height: '0',
											margin: '0',
											overflow: 'hidden'
										}}
									/>
								</virtual>
							);
						});
					}
				}}
			</CheckboxGroup>
			<pre>{`${get('custom')}`}</pre>
		</Example>
	);
});

export default App;
