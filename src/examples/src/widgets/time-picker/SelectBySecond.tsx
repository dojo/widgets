import { create, tsx } from '@dojo/framework/core/vdom';
import TimePicker from '@dojo/widgets/time-picker';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TimePicker min="12:00:00" max="12:00:59" step={1}>
				{{ label: 'Time: ' }}
			</TimePicker>
		</Example>
	);
});
