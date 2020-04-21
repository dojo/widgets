import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';
import Example from '../../Example';

const factory = create();

export default factory(function DisabledSlider() {
	return (
		<Example>
			<Slider min={0} initialValue={50} max={100} disabled>
				{{ label: 'Disabled' }}
			</Slider>
		</Example>
	);
});
