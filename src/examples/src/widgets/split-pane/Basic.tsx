import { create, tsx } from '@dojo/framework/core/vdom';
import SplitPane from '@dojo/widgets/split-pane';

const factory = create();

export default factory(function Basic() {
	return <SplitPane />;
});
