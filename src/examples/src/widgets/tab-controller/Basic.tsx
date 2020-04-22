import { tsx, create } from '@dojo/framework/core/vdom';

import TabContainer from './node_modules/@dojo/widgets/tab-container';
import TabContent from './node_modules/@dojo/widgets/tab-container/TabContent';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	const tabs = [
		{ id: 'tab0', label: 'Tab One' },
		{ id: 'tab1', label: 'Tab Two' },
		{ id: 'tab2', label: 'Tab Three' },
		{ id: 'tab3', label: 'Tab Four' }
	];

	return (
		<Example>
			<TabContainer tabs={tabs}>
				{(_tabs, isActive) => [
					<TabContent key="tab0" active={isActive('tab0')}>
						Hello Tab One
					</TabContent>,
					<TabContent key="tab1" active={isActive('tab1')}>
						Hello Tab Two
					</TabContent>,
					<TabContent key="tab2" active={isActive('tab2')}>
						Hello Tab Three
					</TabContent>,
					<TabContent key="tab3" active={isActive('tab3')}>
						Hello Tab Four
					</TabContent>
				]}
			</TabContainer>
		</Example>
	);
});
