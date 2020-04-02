import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';

const factory = create();

export default factory(function LabelledRadioButton() {
	return (
		<Radio>
			{{
				label: () => 'Radio Button 1'
			}}
		</Radio>
	);
});
