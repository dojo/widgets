import { create, tsx } from '@dojo/framework/core/vdom';
import OutlinedButton from '@dojo/widgets/outlined-button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ToggleButton({ middleware: { icache } }) {
	const pressed = icache.getOrSet('pressed', false);

	return (
		<OutlinedButton pressed={pressed} onClick={() => icache.set('pressed', !pressed)}>
			Toggle Button
		</OutlinedButton>
	);
});
