import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Calendar, { FirstDayOfWeek } from '@dojo/widgets/calendar';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const date = icache.getOrSet('date', new Date());

	return (
		<virtual>
			<Calendar firstDayOfWeek={FirstDayOfWeek.monday} initialValue={date} />
			<Calendar firstDayOfWeek={4} initialValue={date} />
		</virtual>
	);
});
