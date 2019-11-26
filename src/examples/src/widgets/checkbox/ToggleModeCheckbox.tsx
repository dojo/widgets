import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Checkbox, { Mode } from '@dojo/widgets/checkbox';

const factory = create({ icache });

export default factory(function ToggleMode({ middleware: { icache } }) {
	const checked = icache.getOrSet('checked', false);
	return (
		<Checkbox
			checked={checked}
			label="Checkbox in 'toggle' mode"
			mode={Mode.toggle}
			onValue={(checked) => {
				icache.set('checked', checked);
			}}
		/>
	);
});
