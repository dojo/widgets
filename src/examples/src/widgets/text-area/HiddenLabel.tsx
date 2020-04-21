import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';
import Example from '../../Example';

const factory = create();

export default factory(function HiddenLabel() {
	return (
		<Example>
			<TextArea labelHidden={true}>Hidden label</TextArea>
		</Example>
	);
});
