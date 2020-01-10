import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import RangeSlider from '@dojo/widgets/range-slider';

const factory = create({ icache });

export default factory(function DisabledRangeSlider({ middleware: { icache } }) {
	return <RangeSlider min={0} max={100} value={{ min: 20, max: 80 }} disabled />;
});
