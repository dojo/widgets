import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

export default factory(function CustomRenderer({ middleware: { icache } }) {
	return (
		<virtual>
			<Select
				label="Basic Select"
				options={options}
				onValue={(value) => {
					icache.set('value', value);
				}}
				itemRenderer={({ selected, value }) => {
					return (
						<div>
							{selected && <span>✅ </span>}
							{value}
						</div>
					);
				}}
			/>
			<pre>{icache.getOrSet('value', '')}</pre>
		</virtual>
	);
});
