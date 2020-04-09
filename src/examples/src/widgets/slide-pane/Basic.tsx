import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<virtual>
			<SlidePane
				title="Basic SlidePane"
				open={icache.getOrSet('open', true)}
				onRequestClose={() => {
					icache.set('open', false);
				}}
			>
				{DEMO_TEXT}
			</SlidePane>
			<button onclick={() => icache.set('open', !icache.get('open'))}>Toggle</button>
		</virtual>
	);
});
