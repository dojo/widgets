import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function TooltipRangeSlider() {
	return (
		<Example>
			<RangeSlider
				initialValue={{
					min: 0,
					max: 100
				}}
				showOutput={true}
				outputIsTooltip={true}
			/>
		</Example>
	);
});
