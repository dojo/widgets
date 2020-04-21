import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function RequiredRangeSlider() {
	return (
		<Example>
			<RangeSlider
				initialValue={{
					min: 0,
					max: 100
				}}
				required
			>
				{{ label: 'A Required Slider' }}
			</RangeSlider>
		</Example>
	);
});
