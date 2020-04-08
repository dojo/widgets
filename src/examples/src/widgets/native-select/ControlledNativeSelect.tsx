import { create, tsx } from '@dojo/framework/core/vdom';
import NativeSelect from '@dojo/widgets/native-select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }, { value: 'unicorn' }];

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<virtual>
			<NativeSelect
				label="Basic Select"
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
				value={icache.getOrSet('value', 'dog')}
			/>
			<pre>{icache.get('value')}</pre>
		</virtual>
	);
});
