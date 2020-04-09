import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';

const factory = create({ icache });

export default factory(function BottomWidthSlidePane({ middleware: { icache } }) {
	return (
		<SlidePane
			title="Bottom Aligned SlidePane"
			open={icache.getOrSet('open', true)}
			align="bottom"
			onRequestClose={() => {
				icache.set('open', false);
			}}
		>
			{DEMO_TEXT}
		</SlidePane>
	);
});
