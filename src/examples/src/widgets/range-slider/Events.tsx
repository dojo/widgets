import RangeSlider from '@dojo/widgets/range-slider';
import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create({ icache });

export default factory(function EventsRangeSlider({ middleware: { icache } }) {
	return (
		<virtual>
			<RangeSlider
				initialValue={{
					min: 0,
					max: 100
				}}
				onValue={() => icache.set('event', 'onValue')}
				onBlur={() => icache.set('event', 'onBlur')}
				onFocus={() => icache.set('event', 'onFocus')}
				onOut={() => icache.set('event', 'onOut')}
				onOver={() => icache.set('event', 'onOver')}
			/>
			<span>{`Last event: ${icache.get('event') || 'Awaiting first event'}`}</span>
		</virtual>
	);
});
