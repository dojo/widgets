import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Icon from '@dojo/widgets/icon';

const factory = create();

const App = factory(function Icon() {
	return <Chip label="Icon Example" iconRenderer={() => <Icon type="alertIcon" />} />;
});

export default App;
