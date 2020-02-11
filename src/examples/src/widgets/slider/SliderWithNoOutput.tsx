import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';

const factory = create({});

export default factory(function SliderWithNoOutput({}) {
	return <Slider min={0} max={100} showOutput={false} />;
});
