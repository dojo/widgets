import { create, tsx } from '@dojo/framework/core/vdom';
import DateInput from '@dojo/widgets/date-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<DateInput name="dateInput" />
		</Example>
	);
});
