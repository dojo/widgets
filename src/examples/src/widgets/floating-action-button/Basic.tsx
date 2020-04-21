import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton, { Icon } from '@dojo/widgets/floating-action-button';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<FloatingActionButton>
				<Icon type="plusIcon" />
			</FloatingActionButton>
		</Example>
	);
});
