import { create, tsx } from '@dojo/framework/core/vdom';
import TimePicker from '@dojo/widgets/time-picker';

const factory = create();

export default factory(function Basic() {
	return <TimePicker label="Time: " min="12:00:00" max="12:00:59" step={1} />;
});
