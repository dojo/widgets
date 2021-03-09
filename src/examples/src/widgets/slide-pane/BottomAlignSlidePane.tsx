import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function BottomWidthSlidePane({ middleware: { icache } }) {
	return (
		<Example>
			<SlidePane
				open={icache.getOrSet('open', true)}
				align="bottom"
				onRequestClose={() => {
					icache.set('open', false);
				}}
			>
				{{ content: DEMO_TEXT, title: 'Bottom Aligned SlidePane' }}
			</SlidePane>
		</Example>
	);
});
