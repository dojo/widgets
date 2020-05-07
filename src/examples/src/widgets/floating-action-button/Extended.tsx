import { create, tsx } from '@dojo/framework/core/vdom';
import FloatingActionButton from '@dojo/widgets/floating-action-button';
import Example from '../../Example';
import { Icon } from '@dojo/widgets/icon';

const factory = create();

export default factory(function Extended() {
	return (
		<Example>
			<FloatingActionButton size="extended">
				<Icon size="large" type="plusIcon" />
				<span>Add Something</span>
			</FloatingActionButton>
		</Example>
	);
});
