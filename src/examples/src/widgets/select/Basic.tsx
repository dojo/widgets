import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [
	{ value: 'cat', label: 'Cat' },
	{ value: 'dog', label: 'Dog' },
	{ value: 'fish', label: 'Fish' }
];

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				label="Basic Select"
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
			<pre>{icache.getOrSet('value', '')}</pre>
		</virtual>
	);
});
