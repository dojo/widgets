import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';

const factory = create();

export default factory(function Basic() {
	return <Slider />;
});
