import { create, tsx } from '@dojo/framework/core/vdom';
import PasswordInput from '@dojo/widgets/password-input';
import Example from '../../Example';

const factory = create();

export default factory(function Disabled() {
	return (
		<Example>
			<PasswordInput disabled>{{ label: 'Enter Password' }}</PasswordInput>
		</Example>
	);
});
