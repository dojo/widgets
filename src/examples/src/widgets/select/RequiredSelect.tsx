import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

export default factory(function RequiredSelect({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				label="Required Select"
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
				required
				onValidate={(valid) => {
					icache.set('valid', valid);
				}}
			/>
			<pre>{`Value: ${icache.getOrSet('value', '')}, Valid: ${icache.get('valid')}`}</pre>
		</virtual>
	);
});
