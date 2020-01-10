import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function EventsRadioButton({ middleware: { icache } }) {
	return (
		<virtual>
			<Radio
				checked={false}
				label={`Last event: ${icache.get('event') || 'Awaiting first event'}`}
				onValue={() => icache.set('event', 'onValue')}
				onBlur={() => icache.set('event', 'onBlur')}
				onFocus={() => icache.set('event', 'onFocus')}
				onOut={() => icache.set('event', 'onOut')}
				onOver={() => icache.set('event', 'onOver')}
			/>
		</virtual>
	);
});
