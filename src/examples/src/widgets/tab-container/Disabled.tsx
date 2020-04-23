import { tsx, create } from '@dojo/framework/core/vdom';

import TabContainer from '@dojo/widgets/tab-container';
import Example from '../../Example';

const factory = create();

export default factory(function Disabled() {
	const tabs = [
		{ disabled: true, name: 'Tab One' },
		{ name: 'Tab Two' },
		{ disabled: true, name: 'Tab Three' },
		{ name: 'Tab Four' }
	];

	return (
		<Example>
			<TabContainer tabs={tabs}>
				<div key="tab0">Hello Tab One</div>
				<div key="tab1">Hello Tab Two</div>
				<div key="tab2">Hello Tab Three</div>
				<div key="tab3">Hello Tab Four</div>
			</TabContainer>
		</Example>
	);
});
