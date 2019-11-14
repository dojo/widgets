import { create, tsx } from '@dojo/framework/core/vdom';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ToggleButton({ middleware: { icache } }) {
	const pressed = icache.getOrSet('pressed', false);

	return (
		<Button pressed={pressed} onClick={() => icache.set('pressed', !pressed)}>
			Toggle Button
		</Button>
	);
});
