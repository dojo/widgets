import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import DateInput from '@dojo/widgets/date-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Kind({ middleware: { icache } }) {
	return (
		<Example>
			<div>
				<div>{icache.get('date')}</div>
				<DateInput
					name="dateInput"
					onValue={(value) => {
						icache.set('date', value);
					}}
				>
					{{
						label: 'Default Kind'
					}}
				</DateInput>
				<br />
				<br />
				<div>{icache.get('date2')}</div>
				<DateInput
					name="dateInput"
					onValue={(value) => {
						icache.set('date2', value);
					}}
					kind="outlined"
				>
					{{
						label: 'Outlined Kind'
					}}
				</DateInput>
			</div>
		</Example>
	);
});
