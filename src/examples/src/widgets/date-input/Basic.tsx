import { create, tsx } from '@dojo/framework/core/vdom';
import DateInput from '@dojo/widgets/date-input';

const factory = create();

export default factory(function Example() {
	return (
		<Example>
			<DateInput name="dateInput" />
		</Example>
	);
});
