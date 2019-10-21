import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TimePicker, { TimeUnits } from '@dojo/widgets/time-picker';
import { getDateFormatter } from '@dojo/framework/i18n/date';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const Today = new Date();

	const { get, set } = icache;
	return (
		<TimePicker
			inputProperties={{
				placeholder: 'Enter a value'
			}}
			getOptionLabel={(option: TimeUnits) => {
				Today.setHours(option.hour);
				Today.setMinutes(option.minute as number);
				return getDateFormatter({ time: 'short' })(Today);
			}}
			label="Time: "
			value={get<string>('date')}
			onValue={(value) => set('date', value)}
			step={1800}
		/>
	);
});
