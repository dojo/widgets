import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';

const factory = create({});

export default factory(function SliderWithCustomOutput({}) {
	return (
		<Slider
			min={0}
			initialValue={0}
			max={100}
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
