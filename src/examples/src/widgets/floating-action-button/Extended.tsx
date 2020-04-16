import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton, { FabIcon } from '@dojo/widgets/floating-action-button';

const factory = create();

export default factory(function Extended() {
	return (
		<FloatingActionButton extended>
			<FabIcon type="plusIcon" />
			<span styles={{ marginLeft: '8px' }}>Add Something</span>
		</FloatingActionButton>
	);
});
