import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';

const factory = create();

export default factory(function DisabledSlider() {
	return (
		<Slider min={0} initialValue={50} max={100} disabled>
			{{ label: 'Disabled' }}
		</Slider>
	);
});
