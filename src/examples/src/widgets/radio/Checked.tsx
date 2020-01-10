import { create, tsx } from '@dojo/framework/core/vdom';
import Radio from '@dojo/widgets/radio';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function CheckedRadioButton({ middleware: { icache } }) {
	const checked = icache.getOrSet('checked', false);

	return (
		<Radio
			checked={checked}
			onValue={() => {
				icache.set('checked', true);
			}}
		/>
	);
});
