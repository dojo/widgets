import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';
import Example from '../../Example';

const factory = create();

export default factory(function Kinds() {
	return (
		<Example>
			<div>
				<TextArea placeholder="Placeholder Text">{{ label: 'Filled Kind' }}</TextArea>
				<br />
				<br />
				<TextArea kind="outlined" placeholder="Placeholder Text">
					{{ label: 'Outlined Kind' }}
				</TextArea>
			</div>
		</Example>
	);
});
