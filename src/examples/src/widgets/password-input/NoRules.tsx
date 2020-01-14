import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import PasswordInput from '@dojo/widgets/password-input';

const factory = create({ icache });

export default factory(function NoRules({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');

	return (
		<PasswordInput
			value={value}
			required
			onValue={(value) => icache.set('value', value)}
			label="Enter Password"
		/>
	);
});
