import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create();

export default factory(function Kinds() {
	return (
		<Example>
			<div>
				<TextInput placeholder="Placeholder Text">{{ label: 'Filled Kind' }}</TextInput>
				<br />
				<br />
				<TextInput kind="outlined" placeholder="Placeholder Text">
					{{ label: 'Outlined Kind' }}
				</TextInput>
			</div>
		</Example>
	);
});
