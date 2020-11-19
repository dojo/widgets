import { create, tsx } from '@dojo/framework/core/vdom';
import NativeSelect from '@dojo/widgets/native-select';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });
const options = [
	{ value: 'cat' },
	{ value: 'dog' },
	{ value: 'fish' },
	{ value: 'unicorn' },
	{ value: 'did' }
];

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<NativeSelect
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
			>
				Basic Select
			</NativeSelect>
			<pre>{JSON.stringify(icache.getOrSet('value', ''))}</pre>
		</Example>
	);
});
