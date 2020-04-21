import LoadingIndicator from '@dojo/widgets/loading-indicator';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<LoadingIndicator />
		</Example>
	);
});
