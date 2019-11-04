import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });
const options = ['cat', 'dog', 'fish'];

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Select
			label="Simple Native Select"
			useNativeElement={true}
			value={icache.get('value')}
			options={options}
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});
