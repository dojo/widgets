import { create, tsx } from '@dojo/framework/core/vdom';
import TimePicker from '@dojo/widgets/time-picker';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Kind({ middleware: { icache } }) {
	return (
		<Example>
			<div>
				<TimePicker step={1800} onValue={(value) => icache.set('value', value)}>
					{{ label: 'Filled Kind' }}
				</TimePicker>
				<div>The value is {icache.get('value') || 'not set'}</div>
				<br />
				<br />
				<TimePicker
					step={1800}
					onValue={(value) => icache.set('value2', value)}
					kind="outlined"
				>
					{{ label: 'Outlined Kind' }}
				</TimePicker>
				<div>The value is {icache.get('value2') || 'not set'}</div>
			</div>
		</Example>
	);
});
