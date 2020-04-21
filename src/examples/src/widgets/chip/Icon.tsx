import { create, tsx } from '@dojo/framework/core/vdom';
import Chip from '@dojo/widgets/chip';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

const App = factory(function IconExample() {
	return (
		<Example>
			<Chip>
				{{
					label: 'Icon Example',
					icon: () => <Icon type="alertIcon" />
				}}
			</Chip>
		</Example>
	);
});

export default App;
