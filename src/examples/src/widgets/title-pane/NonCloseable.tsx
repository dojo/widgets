import { create, tsx } from '@dojo/framework/core/vdom';
import TitlePane from '@dojo/widgets/title-pane';

const factory = create();

export default factory(function Basic() {
	return (
		<TitlePane title="I can't be closed" closeable={false}>
			<div>
				Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id purus ipsum.
				Aenean ac purus purus. Nam sollicitudin varius augue, sed lacinia felis tempor in.
			</div>
		</TitlePane>
	);
});
