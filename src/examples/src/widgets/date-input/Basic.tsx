import { create, tsx } from '@dojo/framework/core/vdom';
import DateInput from '@dojo/widgets/date-input';

const factory = create();

const Example = factory(function Example() {
	return <DateInput name="dateInput" />;
});

export default Example;
