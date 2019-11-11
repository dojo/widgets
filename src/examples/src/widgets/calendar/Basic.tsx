import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Calendar from '@dojo/widgets/calendar';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const date = icache.getOrSet('date', new Date());
	const month = icache.getOrSet('month', date.getMonth());
	const year = icache.getOrSet('year', date.getFullYear());

	return (
		<Calendar
			selectedDate={date}
			year={year}
			month={month}
			onMonthChange={(month) => {
				icache.set('month', month);
			}}
			onYearChange={(year) => {
				icache.set('year', year);
			}}
			onDateSelect={(date) => {
				icache.set('date', date);
			}}
		/>
	);
});
