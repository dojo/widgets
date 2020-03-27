import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<virtual>
			<SlidePane open={icache.get('open')} onRequestClose={() => icache.set('open', false)} />
			<button onclick={() => icache.set('open', !icache.get('open'))}>Toggle</button>
		</virtual>
	);
});
