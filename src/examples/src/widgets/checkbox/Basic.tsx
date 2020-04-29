import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Checkbox from '@dojo/widgets/checkbox';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const checked = icache.getOrSet('checked', true);
	return (
		<Example>
			<Checkbox
				checked={checked}
				onValue={(checked) => {
					icache.set('checked', checked);
				}}
			>
				Sample checkbox that starts checked
			</Checkbox>
		</Example>
	);
});
