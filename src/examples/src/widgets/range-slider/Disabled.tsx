import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function DisabledRangeSlider() {
	return (
		<Example>
			<RangeSlider initialValue={{ min: 20, max: 80 }} disabled />
		</Example>
	);
});
