import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import Example from '../../Example';

const factory = create();

export default factory(function LabelledRadioButton() {
	return (
		<Example>
			<Radio>Radio Button 1</Radio>
		</Example>
	);
});
