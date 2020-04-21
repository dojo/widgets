import TitlePane from '@dojo/widgets/title-pane';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TitlePane headingLevel={2}>
				{{
					title: 'Aria Heading Level 2',
					content: (
						<div>
							Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque id
							purus ipsum. Aenean ac purus purus. Nam sollicitudin varius augue, sed
							lacinia felis tempor in.
						</div>
					)
				}}
			</TitlePane>
		</Example>
	);
});
