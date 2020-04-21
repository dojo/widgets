import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton, { Icon } from '@dojo/widgets/floating-action-button';
import Example from '../../Example';

const factory = create();

export default factory(function Extended() {
	return (
		<Example>
			<FloatingActionButton extended>
				<Icon type="plusIcon" />
				<span>Add Something</span>
			</FloatingActionButton>
		</Example>
	);
});
