import { create, tsx } from '@dojo/framework/core/vdom';
import NumberInput from '@dojo/widgets/number-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<NumberInput>
				{{
					label: 'Number Input'
					// ,
					// leading: '$',
					// trailing: '.00'
				}}
			</NumberInput>
		</Example>
	);
});
