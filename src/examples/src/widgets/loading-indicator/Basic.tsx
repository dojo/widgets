import LoadingIndicator from '@dojo/widgets/loading-indicator';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function Basic() {
	return <LoadingIndicator />;
});
