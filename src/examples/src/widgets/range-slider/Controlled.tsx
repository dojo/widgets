import RangeSlider from '@dojo/widgets/range-slider';
import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const value = icache.getOrSet('value', { min: 10, max: 90 });
	return (
		<RangeSlider
			onValue={(value) => {
				icache.set('value', value);
			}}
			value={value}
		/>
	);
});
