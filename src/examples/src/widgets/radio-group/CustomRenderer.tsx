import RadioGroup from '@dojo/widgets/radio-group';
import { Radio } from '@dojo/widgets/radio';
import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<virtual>
			<RadioGroup
				name="custom"
				options={[{ value: 'yes' }, { value: 'no' }, { value: 'maybe' }]}
				onValue={(value) => {
					set('custom', value);
				}}
			>
				{{
					label: 'going?',
					radios: (name, radioGroup, options) => {
						return options.map(({ value, label }) => {
							const { checked } = radioGroup(value);
							return (
								<virtual>
									<span>I'm custom!</span>
									<Radio
										checked={checked()}
										label={label || value}
										name={name}
										onValue={checked}
										value={value}
									/>
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
			</RadioGroup>
			<pre>{`${get('custom')}`}</pre>
		</virtual>
	);
});

export default App;
