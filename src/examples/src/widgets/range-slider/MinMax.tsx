import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import RangeSlider from '@dojo/widgets/range-slider';

const factory = create({ icache });

export default factory(function MinMaxRangeSlider({ middleware: { icache } }) {
	const min = 0;
	const max = 100;
	const value = icache.getOrSet('value', { min, max });

	return (
		<RangeSlider
			min={0}
			max={100}
			value={value}
			onValue={(newValue) => {
				icache.set('value', newValue);
			}}
		/>
	);
});
