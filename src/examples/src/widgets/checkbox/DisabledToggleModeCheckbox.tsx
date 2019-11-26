import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Checkbox, { Mode } from '@dojo/widgets/checkbox';

const factory = create({ icache });

export default factory(function DisabledToggleMode({ middleware: { icache } }) {
	const checked = icache.getOrSet('checked', false);
	return (
		<Checkbox
			checked={checked}
			label="Disabled toggle mode"
			onLabel="On"
			offLabel="Off"
			mode={Mode.toggle}
			disabled
			onValue={(checked) => {
				icache.set('checked', checked);
			}}
		/>
	);
});
