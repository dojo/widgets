import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';

const factory = create();

export default factory(function Label() {
	return <TextArea>Textarea with label</TextArea>;
});
