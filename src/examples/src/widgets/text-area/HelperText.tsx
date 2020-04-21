import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';
import Example from '../../Example';

const factory = create();

export default factory(function HelperText() {
	return (
		<Example>
			<TextArea helperText="Hi there, enter some text">Has helper text</TextArea>
		</Example>
	);
});
