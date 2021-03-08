import { create, tsx } from '@dojo/framework/core/vdom';
import NumberInput from '@dojo/widgets/number-input';
import { Addon } from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<NumberInput>
				{{
					label: 'Number Input',
					leading: <Addon>$</Addon>,
					trailing: <Addon filled>MM</Addon>
				}}
			</NumberInput>
		</Example>
	);
});
