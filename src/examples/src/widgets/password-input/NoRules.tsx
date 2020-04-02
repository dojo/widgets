import { create, tsx } from '@dojo/framework/core/vdom';
import PasswordInput from '@dojo/widgets/password-input';

const factory = create();

export default factory(function NoRules() {
	return <PasswordInput required>{{ label: 'Enter Password' }}</PasswordInput>;
});
