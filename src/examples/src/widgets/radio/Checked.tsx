import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function CheckedRadioButton({ middleware: { icache } }) {
	const checked = icache.getOrSet('checked', false);

	return (
		<Example>
			<Radio
				checked={checked}
				onValue={() => {
					icache.set('checked', true);
				}}
			/>
		</Example>
	);
});
