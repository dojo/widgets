import { tsx, create } from '@dojo/framework/core/vdom';

import TabController from '@dojo/widgets/tab-controller';
import TabContent from '@dojo/widgets/tab-controller/TabContent';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const tabs = [
		{ id: 'tab0', label: 'Tab One' },
		{ id: 'tab1', label: 'Tab Two' },
		{ id: 'tab2', label: 'Tab Three' },
		{ id: 'tab3', label: 'Tab Four' }
	];

	return (
		<TabController
			activeTab={icache.getOrSet('activeTab', 'tab2')}
			onActiveTab={(activeTab) => icache.set('activeTab', activeTab)}
			tabs={tabs}
		>
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
		</TabController>
	);
});
