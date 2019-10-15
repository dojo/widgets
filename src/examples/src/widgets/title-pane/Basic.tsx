import { create, tsx } from '@dojo/framework/core/vdom';
import TitlePane from '@dojo/widgets/title-pane';

const factory = create();

export default factory(function Basic() {
	return <TitlePane title="Basic Title Pane" />;
});
