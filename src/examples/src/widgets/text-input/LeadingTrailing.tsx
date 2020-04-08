import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput, { Addon } from '@dojo/widgets/text-input';

const factory = create();

export default factory(function Basic() {
	return (
		<TextInput>
			{{
				label: 'Input label',
				leading: <Addon>A</Addon>,
				trailing: <Addon filled>Z</Addon>
			}}
		</TextInput>
	);
});
