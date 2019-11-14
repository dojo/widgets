import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Switch from '@dojo/widgets/switch';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const checked = icache.getOrSet('checked', false);
	return (
		<Switch
			checked={checked}
			name="Switch"
			label="On/Off"
			onChange={(checked) => {
				icache.set('checked', checked);
			}}
		/>
	);
});
