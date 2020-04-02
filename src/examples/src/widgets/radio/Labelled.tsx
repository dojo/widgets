import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import Label from '@dojo/widgets/label';

const factory = create();

export default factory(function LabelledRadioButton() {
	return (
		<Radio widgetId="radioId">
			{{
				label: () => <Label forId="radioId">Radio Button 1</Label>
			}}
		</Radio>
	);
});
