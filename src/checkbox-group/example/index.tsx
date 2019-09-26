import { create, tsx } from '@dojo/framework/core/vdom';
import CheckboxGroup from '../index';
import { Checkbox } from '../../checkbox/index';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const App = factory(function({ properties, middleware: { icache } }) {
	const { get, set } = icache;

	return (
		<div>
			<h1>Standard Example</h1>
			<CheckboxGroup
				label="pets"
				name="standard"
				options={[{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }]}
				onValue={(value) => {
					set('standard', value);
				}}
			/>
			<pre>{`${get('standard')}`}</pre>
			<br />
			<h1>Initial Valie Example</h1>
			<CheckboxGroup
				label="favourite names"
				initialValue={['tom']}
				name="initial-value"
				options={[{ value: 'tom' }, { value: 'dick' }, { value: 'harry' }]}
				onValue={(value) => {
					set('initial-value', value);
				}}
			/>
			<pre>{`${get('initial-value')}`}</pre>
			<br />
			<h1>Label Example</h1>
			<CheckboxGroup
				label="colours"
				name="colours"
				options={[
					{ value: 'red', label: 'Rouge' },
					{ value: 'green', label: 'Vert' },
					{ value: 'blue', label: 'Bleu' }
				]}
				onValue={(value) => {
					set('colours', value);
				}}
			/>
			<pre>{`${get('colours')}`}</pre>
			<br />
			<h1>Custom Example</h1>
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
		</div>
	);
});

export default App;
