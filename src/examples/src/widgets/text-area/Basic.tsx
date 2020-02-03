import { create, tsx } from '@dojo/framework/core/vdom';
import TextArea from '@dojo/widgets/text-area';

const factory = create();

export default factory(function Basic() {
	return <TextArea />;
});
