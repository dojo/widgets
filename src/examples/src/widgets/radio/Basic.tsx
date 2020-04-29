import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<Radio
				checked={icache.getOrSet('checked', false)}
				onValue={(checked) => {
					icache.set('checked', checked);
				}}
			/>
		</Example>
	);
});
