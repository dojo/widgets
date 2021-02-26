import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import DateInput from '@dojo/widgets/date-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<div>
				<div>{icache.get('date')}</div>
				<DateInput
					name="dateInput"
					onValue={(value) => {
						icache.set('date', value);
					}}
				/>
			</div>
		</Example>
	);
});
