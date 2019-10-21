import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import TimePicker, { TimeUnits, getOptions } from '@dojo/widgets/time-picker';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const options = getOptions();

	function getFilteredOptions(value: string | undefined) {
		let matching: TimeUnits[] = [];

		if (value) {
			matching = options.filter((option) => {
				const { hour, minute = 0 } = option;
				const hours = hour >= 10 ? hour : `0${hour}`;
				const minutes = minute >= 10 ? minute : `0${minute}`;
				return `${hours}:${minutes}`.indexOf(value) === 0;
			});
		}

		return matching.length ? matching : options;
	}

	const { get, set } = icache;
	return (
		<TimePicker
			inputProperties={{
				placeholder: 'Enter a value'
			}}
			label="Time: "
			value={get<string>('date')}
			onValue={(value) => set('date', value)}
			onRequestOptions={() => {
				set('options', getFilteredOptions(get<string>('date')));
			}}
			options={get<TimeUnits[]>('options')}
		/>
	);
});
