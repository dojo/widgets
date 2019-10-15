import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';

const factory = create();

export default factory(function Basic() {
	return <Radio />;
});
