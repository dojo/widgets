import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton, { FabIcon } from '@dojo/widgets/floating-action-button';

const factory = create();

export default factory(function Basic() {
	return (
		<FloatingActionButton>
			<FabIcon type="plusIcon" />
		</FloatingActionButton>
	);
});
