import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Calendar from '@dojo/widgets/calendar';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function FullyControlled({ middleware: { icache } }) {
	const date = icache.getOrSet('date', new Date(2019, 0, 11));

	return (
		<Example>
			<Calendar
				value={date}
				month={0}
				year={2019}
				onValue={(date) => {
					icache.set('date', date);
				}}
			/>
			<div>Selected date is {date.toLocaleDateString()}</div>
		</Example>
	);
});
