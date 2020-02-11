import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';

const factory = create({});

export default factory(function VerticalSlider({}) {
	return (
		<div styles={{ margin: '2em' }}>
			<Slider min={0} max={100} vertical />
		</div>
	);
});
