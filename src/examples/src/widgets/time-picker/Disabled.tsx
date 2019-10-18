import { create, tsx } from '@dojo/framework/core/vdom';
import TimePicker from '@dojo/widgets/time-picker';
import setLocaleData from './setLocaleData';

setLocaleData();

const factory = create();

export default factory(function Basic() {
	return (
		<TimePicker
			inputProperties={{
				placeholder: 'Enter a value'
			}}
			label="Time: "
			readOnly
		/>
	);
});
