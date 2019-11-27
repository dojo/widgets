import { create, tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '@dojo/widgets/raised-button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function ToggleButton({ middleware: { icache } }) {
	const pressed = icache.getOrSet('pressed', false);

	return (
		<RaisedButton pressed={pressed} onClick={() => icache.set('pressed', !pressed)}>
			Toggle Button
		</RaisedButton>
	);
});
