import { create, tsx } from '@dojo/framework/core/vdom';
import ConstrainedInput from '@dojo/widgets/constrained-input';

const factory = create();

export default factory(function Basic() {
	return (
		<ConstrainedInput
			rules={{
				length: {
					min: 4,
					max: 16
				},
				contains: {
					numbers: 1,
					uppercase: 1,
					specialCharacters: 1
				}
			}}
		>
			{{ label: 'Enter Username' }}
		</ConstrainedInput>
	);
});
