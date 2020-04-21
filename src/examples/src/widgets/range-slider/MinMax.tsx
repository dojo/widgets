import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function MinMaxRangeSlider() {
	return (
		<Example>
			<RangeSlider
				min={0}
				max={100}
				initialValue={{
					min: 0,
					max: 100
				}}
			/>
		</Example>
	);
});
