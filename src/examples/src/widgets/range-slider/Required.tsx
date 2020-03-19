import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function RequiredRangeSlider() {
	return (
		<RangeSlider
			initialValue={{
				min: 0,
				max: 100
			}}
			label="A Required Slider"
			required
		/>
	);
});
