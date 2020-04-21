import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function UnderlaySlidePane({ middleware: { icache } }) {
	return (
		<Example>
			<SlidePane
				title="Underlay SlidePane"
				open={icache.getOrSet('open', true)}
				underlay={true}
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
