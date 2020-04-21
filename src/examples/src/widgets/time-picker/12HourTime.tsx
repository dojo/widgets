import { create, tsx } from '@dojo/framework/core/vdom';
import TimePicker from '@dojo/widgets/time-picker';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TimePicker step={1800} format="12">
				{{ label: 'Time: ' }}
			</TimePicker>
		</Example>
	);
});
