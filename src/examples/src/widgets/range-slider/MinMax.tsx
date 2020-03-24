import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function MinMaxRangeSlider() {
	return (
		<RangeSlider
			min={0}
			max={100}
			initialValue={{
				min: 0,
				max: 100
			}}
		/>
	);
});
