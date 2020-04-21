import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TextInput labelHidden>{{ label: 'Hidden label' }}</TextInput>
		</Example>
	);
});
