import { create, tsx } from '@dojo/framework/core/vdom';
import PasswordInput from '@dojo/widgets/password-input';
import Example from '../../Example';

const factory = create();

export default factory(function NoRules() {
	return (
		<Example>
			<PasswordInput required>{{ label: 'Enter Password' }}</PasswordInput>
		</Example>
	);
});
