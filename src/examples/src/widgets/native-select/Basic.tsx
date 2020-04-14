import { create, tsx } from '@dojo/framework/core/vdom';
import NativeSelect from '@dojo/widgets/native-select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }, { value: 'unicorn' }];

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<virtual>
			<NativeSelect
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				Basic Select
			</NativeSelect>
			<pre>{icache.getOrSet('value', '')}</pre>
		</virtual>
	);
});
