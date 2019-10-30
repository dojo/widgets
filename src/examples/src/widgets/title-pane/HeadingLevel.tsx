import { create, tsx } from '@dojo/framework/core/vdom';
import TitlePane from '@dojo/widgets/title-pane';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const open = icache.get('open');

	return (
		<TitlePane
			title="Aria Heading level 2"
			headingLevel={2}
			open={!!open}
			onRequestOpen={() => {
				icache.set('open', true);
			}}
			onRequestClose={() => {
				icache.set('open', false);
			}}
		>
			<div>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id purus ipsum.
				Aenean ac purus purus. Nam sollicitudin varius augue, sed lacinia felis tempor in.
			</div>
		</TitlePane>
	);
});
