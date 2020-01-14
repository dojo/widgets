import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Slider from '@dojo/widgets/slider';

const factory = create({ icache });

export default factory(function SliderWithCustomOutput({ middleware: { icache } }) {
	const value = icache.getOrSet<number>('value', 0);
	return (
		<Slider
			min={0}
			value={value}
			max={100}
			onValue={(value) => icache.set('value', value)}
			output={(value) => {
				if (value < 20) {
					return 'I am a Klingon';
				}
				if (value < 40) {
					return 'Tribbles only cause trouble';
				}
				if (value < 60) {
					return 'They\`re kind of cute';
				}
				if (value < 80) {
					return 'Most of my salary goes to tribble food';
				} else {
					return 'I permanently altered the ecology of a planet for my tribbles';
				}
			}}
		/>
	);
});
