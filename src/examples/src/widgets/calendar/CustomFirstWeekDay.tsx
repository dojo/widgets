import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Calendar, { FirstDayOfWeek } from '@dojo/widgets/calendar';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const date = icache.getOrSet('date', new Date());

	return (
		<Example>
			<Calendar firstDayOfWeek={FirstDayOfWeek.monday} initialValue={date} />
		</Example>
	);
});
