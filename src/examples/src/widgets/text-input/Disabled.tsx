import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';

const factory = create();

export default factory(function Basic() {
	return (
		<TextInput initialValue="disabled input text" disabled readOnly>
			{{ label: "Can't type here" }}
		</TextInput>
	);
});
