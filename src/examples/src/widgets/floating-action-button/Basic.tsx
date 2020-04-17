import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton, { Icon } from '@dojo/widgets/floating-action-button';

const factory = create();

export default factory(function Basic() {
	return (
		<FloatingActionButton>
			<Icon type="plusIcon" />
		</FloatingActionButton>
	);
});
