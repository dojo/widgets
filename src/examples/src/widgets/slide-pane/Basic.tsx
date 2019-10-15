import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';

const factory = create();

export default factory(function Basic() {
	return <SlidePane />;
});
