import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton from '@dojo/widgets/floating-action-button';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function Small() {
	return (
		<FloatingActionButton size="small">
			<Icon type="plusIcon" />
		</FloatingActionButton>
	);
});
