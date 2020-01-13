import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import RangeSlider from '@dojo/widgets/range-slider';

const factory = create({ icache });

export default factory(function EventsRangeSlider({ middleware: { icache } }) {
	const min = 0;
	const max = 100;
	const value = icache.getOrSet('value', { min, max });

	return (
		<virtual>
			<RangeSlider
				min={0}
				max={100}
				value={value}
				onValue={(newValue) => {
					icache.set('value', newValue);
					icache.set('event', 'onValue');
				}}
				onBlur={() => icache.set('event', 'onBlur')}
				onFocus={() => icache.set('event', 'onFocus')}
				onOut={() => icache.set('event', 'onOut')}
				onOver={() => icache.set('event', 'onOver')}
			/>
			<span>{`Last event: ${icache.get('event') || 'Awaiting first event'}`}</span>
		</virtual>
	);
});
