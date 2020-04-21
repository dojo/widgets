import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function FixedWidthSlidePane({ middleware: { icache } }) {
	return (
		<Example>
			<SlidePane
				title="Fixed Width"
				open={icache.getOrSet('open', true)}
				width={250}
				align="right"
				onRequestClose={() => {
					icache.set('open', false);
				}}
			>
				{DEMO_TEXT}
			</SlidePane>
		</Example>
	);
});
