import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
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
		</Example>
	);
});
