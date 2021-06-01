import { create, tsx } from '@dojo/framework/core/vdom';
import TextInput from '@dojo/widgets/text-input';
import Example from '../../Example';

const factory = create();

export default factory(function Kinds() {
	return (
		<Example>
			<div>
				<TextInput kind="default">{{ label: 'Default Kind' }}</TextInput>
				<br />
				<br />
				<TextInput kind="outlined">{{ label: 'Outlined Kind' }}</TextInput>
			</div>
		</Example>
	);
});
