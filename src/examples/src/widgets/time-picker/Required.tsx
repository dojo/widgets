import { create, tsx } from '@dojo/framework/core/vdom';
import TimePicker from '@dojo/widgets/time-picker';

const factory = create();

export default factory(function Basic() {
	return (
		<TimePicker required step={1800}>
			{{ label: 'Time: ' }}
		</TimePicker>
	);
});
