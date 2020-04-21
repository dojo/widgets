import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Slider from '@dojo/widgets/slider';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const value = icache.getOrSet('value', 50);

	return (
		<Example>
			<Slider
				min={0}
				max={100}
				value={value}
				onValue={(value) => {
					icache.set('value', value);
				}}
			/>
		</Example>
	);
});
