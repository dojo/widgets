import TitlePane from '@dojo/widgets/title-pane';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function Basic() {
	return (
		<TitlePane>
			{{
				title: () => 'Basic',
				content: () => (
					<div>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id purus
						ipsum. Aenean ac purus purus. Nam sollicitudin varius augue, sed lacinia
						felis tempor in.
					</div>
				)
			}}
		</TitlePane>
	);
});
