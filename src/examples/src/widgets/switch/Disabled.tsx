import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Switch from '@dojo/widgets/switch';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const switched = icache.getOrSet('switched', false);
	return (
		<Example>
			<div>
				<Switch
					value={switched}
					name="Switch"
					disabled={true}
					onValue={(switched) => {
						icache.set('checked', switched);
					}}
				>
					{{ label: 'Disabled Off' }}
				</Switch>
				<Switch
					value={!switched}
					name="Switch"
					disabled={true}
					onValue={(switched) => {
						icache.set('switched', switched);
					}}
				>
					{{ label: 'Disabled On' }}
				</Switch>
			</div>
		</Example>
	);
});
