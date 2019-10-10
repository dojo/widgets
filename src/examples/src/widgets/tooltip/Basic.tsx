import { create, tsx } from '@dojo/framework/core/vdom';
import Tooltip from '@dojo/widgets/tooltip';

const factory = create();

export default factory(function Basic() {
	return <Tooltip content="tooltip" />;
});
