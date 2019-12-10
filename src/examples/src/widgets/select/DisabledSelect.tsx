import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = [{ value: 'cat' }, { value: 'dog' }, { value: 'fish' }];

export default factory(function DisabledSelect() {
	return (
		<virtual>
			<Select label="Disabled Select" options={options} disabled onValue={() => {}} />
		</virtual>
	);
});
