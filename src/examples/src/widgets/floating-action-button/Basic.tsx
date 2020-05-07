import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton from '@dojo/widgets/floating-action-button';
import Example from '../../Example';
import { Icon } from '@dojo/widgets/icon';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<FloatingActionButton>
				<Icon size="large" type="plusIcon" />
			</FloatingActionButton>
		</Example>
	);
});
