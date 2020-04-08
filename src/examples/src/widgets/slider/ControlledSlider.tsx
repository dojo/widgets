import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const value = icache.getOrSet('value', 50);

	return (
		<Slider
			min={0}
			max={100}
			value={value}
			onValue={(value) => {
				icache.set('value', value);
			}}
		/>
	);
});
