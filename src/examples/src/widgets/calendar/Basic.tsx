import { create, tsx } from '@dojo/framework/core/vdom';
import Calendar from '@dojo/widgets/calendar';

const factory = create();

export default factory(function Basic() {
	return <Calendar />;
});
