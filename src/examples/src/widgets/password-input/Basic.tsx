import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import PasswordInput from '@dojo/widgets/password-input';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value = icache.getOrSet('value', '');

	return (
		<PasswordInput
			rules={{
				length: {
					min: 4
				},
				contains: {
					atLeast: 2,
					uppercase: 1,
					specialCharacters: 1,
					numbers: 1
				}
			}}
			value={value}
			onValue={(value) => icache.set('value', value)}
			label="Enter Password"
		/>
	);
});
