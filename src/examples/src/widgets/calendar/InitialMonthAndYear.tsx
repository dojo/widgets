import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Calendar from '@dojo/widgets/calendar';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function InitialMonthAndYear({ middleware: { icache } }) {
	const month = icache.getOrSet('month', 5);
	const year = icache.getOrSet('year', 2017);

	return (
		<Example>
			<Calendar
				initialMonth={5}
				initialYear={2017}
				onMonth={(month) => {
					icache.set('month', month);
				}}
				onYear={(year) => {
					icache.set('year', year);
				}}
			/>
			<div>Displayed month and year is {`${month + 1}/${year}`}</div>
		</Example>
	);
});
