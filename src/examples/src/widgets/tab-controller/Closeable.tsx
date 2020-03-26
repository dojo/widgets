import { tsx, create } from '@dojo/framework/core/vdom';

import TabController from '@dojo/widgets/tab-controller';
import TabContent from '@dojo/widgets/tab-controller/TabContent';

const factory = create();

export default factory(function Closeable() {
	const tabs = [
		{ closeable: true, label: 'Tab One' },
		{ label: 'Tab Two' },
		{ label: 'Tab Three' },
		{ label: 'Tab Four' }
	];

	return (
		<TabController tabs={tabs}>
			{(_tabs, isActive, isClosed) => [
				<TabContent key="tab0" active={isActive(0)} closed={isClosed(0)}>
					Hello Tab One
				</TabContent>,
				<TabContent key="tab1" active={isActive(1)} closed={isClosed(1)}>
					Hello Tab Two
				</TabContent>,
				<TabContent key="tab2" active={isActive(2)} closed={isClosed(2)}>
					Hello Tab Three
				</TabContent>,
				<TabContent key="tab3" active={isActive(3)} closed={isClosed(3)}>
					Hello Tab Four
				</TabContent>
			]}
		</TabController>
	);
});
