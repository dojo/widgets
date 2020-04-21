import { create, tsx } from '@dojo/framework/core/vdom';
import PasswordInput from '@dojo/widgets/password-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
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
			>
				{{ label: 'Enter Password' }}
			</PasswordInput>
		</Example>
	);
});
