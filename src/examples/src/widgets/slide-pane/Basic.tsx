import { create, tsx } from '@dojo/framework/core/vdom';
import SlidePane from '@dojo/widgets/slide-pane';
import icache from '@dojo/framework/core/middleware/icache';
import { DEMO_TEXT } from './common';
import Example from '../../Example';
import { Dialog } from '@dojo/widgets/dialog';
import TimePicker from '@dojo/widgets/time-picker';
import Button from '@dojo/widgets/button';
import { Link } from '@dojo/framework/routing/Link';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<Dialog
				onRequestClose={() => icache.set('dialog', false)}
				open={icache.getOrSet('dialog', false)}
			>
				{{ content: <TimePicker /> }}
			</Dialog>
			<SlidePane
				title="Basic SlidePane"
				open={icache.getOrSet('open', false)}
				onRequestClose={() => {
					icache.set('open', false);
				}}
			>
				{DEMO_TEXT}
				<TimePicker />
				<button onclick={() => icache.set('dialog', !icache.get('dialog'))}>
					toggle dialog
				</button>
			</SlidePane>
			<button onclick={() => icache.set('open', !icache.get('open'))}>Toggle</button>
			<Link to="abc">
				<Button>Hello</Button>
			</Link>
		</Example>
	);
});
