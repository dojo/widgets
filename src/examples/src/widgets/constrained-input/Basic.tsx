import { create, tsx } from '@dojo/framework/core/vdom';
import ConstrainedInput from '@dojo/widgets/constrained-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<ConstrainedInput
				rules={{
					length: {
						min: 1,
						max: 10
					}
				}}
			>
				{{ label: 'Minimum and Maximum Length Constraints' }}
			</ConstrainedInput>
		</Example>
	);
});
