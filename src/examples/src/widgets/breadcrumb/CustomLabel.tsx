import { create, tsx } from '@dojo/framework/core/vdom';
import Breadcrumb from '@dojo/widgets/breadcrumb';
import Icon from '@dojo/widgets/icon';

import * as css from './CustomLabel.m.css';

const factory = create();

const App = factory(function() {
	const label = (text: string) => (
		<virtual>
			<span styles={{ paddingRight: '8px' }}>
				<Icon classes={{ '@dojo/widgets/icon': { icon: [css.icon] } }} type="checkIcon" />
			</span>
			{text}
		</virtual>
	);

	const items = [
		{ key: 'step1', label: label('Step 1') },
		{ key: 'step2', label: label('Step 2') },
		{ key: 'step3', label: 'Step 3' }
	];

	return <Breadcrumb label="breadcrumb" itemLevel="step" current={2} items={items} />;
});

export default App;
