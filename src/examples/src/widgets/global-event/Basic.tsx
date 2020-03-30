import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import GlobalEvent from '@dojo/widgets/global-event';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const keyup = (event: KeyboardEvent) => {
		event.stopPropagation();
		icache.set('keycode', event.which);
	};

	return (
		<virtual key="root">
			<GlobalEvent key="global" document={{ keyup }} />
			<div>Press a key to get the JavaScript event keycode.</div>

			{icache.get('keycode') && (
				<div key="result" style="color: ">
					Keycode of pressed key: {`${icache.get('keycode')}`}
				</div>
			)}
		</virtual>
	);
});
