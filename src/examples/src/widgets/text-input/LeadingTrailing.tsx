import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput, { Addon } from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TextInput>
				{{
					label: 'Input label',
					leading: <Addon>A</Addon>,
					trailing: <Addon filled>Z</Addon>
				}}
			</TextInput>
		</Example>
	);
});
