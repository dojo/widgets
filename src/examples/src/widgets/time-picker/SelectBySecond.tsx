import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TimePicker from '@dojo/widgets/time-picker';
import setLocaleData from './setLocaleData';

setLocaleData();

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const { get, set } = icache;
	return (
		<TimePicker
			inputProperties={{
				placeholder: 'Enter a value'
			}}
			label="Time: "
			value={get<string>('date')}
			onValue={(value) => set('date', value)}
			start="12:00:00"
			end="12:00:59"
			step={1}
		/>
	);
});
