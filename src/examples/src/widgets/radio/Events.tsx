import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function EventsRadioButton({ middleware: { icache } }) {
	return (
		<Example>
			<Radio
				checked={false}
				onValue={() => icache.set('event', 'onValue')}
				onBlur={() => icache.set('event', 'onBlur')}
				onFocus={() => icache.set('event', 'onFocus')}
				onOut={() => icache.set('event', 'onOut')}
				onOver={() => icache.set('event', 'onOver')}
			>
				{`Last event: ${icache.get('event') || 'Awaiting first event'}`}
			</Radio>
		</Example>
	);
});
