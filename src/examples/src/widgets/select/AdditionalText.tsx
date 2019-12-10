import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

export default factory(function AdditionalText({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				label="Additional Text"
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
				helperText="I am the helper text"
				placeholder="I am a placeholder"
			/>
			<pre>{`Value: ${icache.getOrSet('value', '')}`}</pre>
		</virtual>
	);
});
