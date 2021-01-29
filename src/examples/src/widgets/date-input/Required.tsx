import { create, tsx } from '@dojo/framework/core/vdom';
import DateInput from '@dojo/widgets/date-input';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	return (
		<Example>
			<DateInput
				value={icache.get('date')}
				onValidate={(valid, message) => {
					icache.set('valid', { valid, message });
				}}
				onValue={(date) => {
					icache.set('date', date);
				}}
				name="dateInput"
				required={true}
			/>
		</Example>
	);
});
