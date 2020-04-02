import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';

const factory = create();

export default factory(function Disabled() {
	return (
		<TextArea initialValue="Initial Value" disabled={true}>
			Can't type here
		</TextArea>
	);
});
