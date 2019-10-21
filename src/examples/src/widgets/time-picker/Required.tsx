import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TimePicker from '@dojo/widgets/time-picker';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const { get, set } = icache;
	return (
		<TimePicker
			inputProperties={{
				placeholder: 'Enter a value'
			}}
			label="Time: "
			required
			valid={get<boolean>('valid')}
			value={get<string>('date')}
			onValue={(value) => {
				set('valid', value.trim().length > 0);
				set('date', value);
			}}
			step={1800}
		/>
	);
});
