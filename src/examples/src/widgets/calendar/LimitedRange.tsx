import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Calendar from '@dojo/widgets/calendar';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function LimitedRange({ middleware: { icache } }) {
	const date = icache.getOrSet('date', new Date());
	const today = new Date();
	const minDate = today;
	const maxDate = new Date(today.getFullYear(), today.getMonth() + 1, 15);

	return (
		<Example>
			<Calendar initialValue={date} minDate={minDate} maxDate={maxDate} />
		</Example>
	);
});
