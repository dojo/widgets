import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Icon from '@dojo/widgets/icon';

const factory = create();

const App = factory(function Icon() {
	return (
		<virtual>
			<Chip label="Icon Example" iconRenderer={() => <Icon type="alertIcon" />} />
		</virtual>
	);
});

export default App;
