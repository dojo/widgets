import { create, tsx } from '@dojo/framework/core/vdom';
import DateInput from '@dojo/widgets/date-input';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const Example = factory(function Controlled({ middleware: { icache } }) {
	return (
		<DateInput
			value={icache.get('date')}
			onValue={(date) => {
				icache.set('date', date);
			}}
			name="dateInput"
		/>
	);
});

export default Example;
