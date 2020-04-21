import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';
import Example from '../../Example';

const factory = create({});

export default factory(function SliderWithNoOutput({}) {
	return (
		<Example>
			<Slider min={0} max={100} showOutput={false} />
		</Example>
	);
});
