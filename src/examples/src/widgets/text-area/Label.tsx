import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';
import Example from '../../Example';

const factory = create();

export default factory(function Label() {
	return (
		<Example>
			<TextArea>Textarea with label</TextArea>
		</Example>
	);
});
