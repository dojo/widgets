import TitlePane from '@dojo/widgets/title-pane';
import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Controlled({ middleware: { icache } }) {
	const open = icache.getOrSet('open', false);
	return (
		<Example>
			<TitlePane
				open={open}
				onClose={() => icache.set('open', false)}
				onOpen={() => icache.set('open', true)}
				name="Controlled Title Pane"
			>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id purus ipsum.
				Aenean ac purus purus. Nam sollicitudin varius augue, sed lacinia felis tempor in.
			</TitlePane>
		</Example>
	);
});
