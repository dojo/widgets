import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select/Select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Select
			label="Simple Select"
			options={options}
			onValue={(value) => {
				icache.set('value', value);
			}}
			helperText="helper"
		/>
	);
});
