import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TabController, { Align } from '@dojo/widgets/tab-controller';
import TabContent from '@dojo/widgets/tab-controller/TabContent';
import Select, { defaultTransform } from '@dojo/widgets/select';
import { createMemoryResourceWithData } from '../list/memoryTemplate';

const factory = create({ icache });
const options = [
	{ value: Align.top, label: 'Top' },
	{ value: Align.left, label: 'Left' },
	{ value: Align.right, label: 'Right' },
	{ value: Align.bottom, label: 'Bottom' }
];
const resource = createMemoryResourceWithData(options);

export default factory(function ButtonAlignment({ middleware: { icache } }) {
	const alignButtons = icache.getOrSet('align', Align.top);
	const tabs = [
		{ label: 'Tab One' },
		{ label: 'Tab Two' },
		{ label: 'Tab Three' },
		{ label: 'Tab Four' }
	];

	return (
		<div>
			<Select
				initialValue={alignButtons}
				resource={resource}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('align', value);
				}}
			/>
			<TabController alignButtons={alignButtons} tabs={tabs}>
				{(_tabs, isActive) => [
					<TabContent key="tab0" active={isActive(0)}>
						Hello Tab One
					</TabContent>,
					<TabContent key="tab1" active={isActive(1)}>
						Hello Tab Two
					</TabContent>,
					<TabContent key="tab2" active={isActive(2)}>
						Hello Tab Three
					</TabContent>,
					<TabContent key="tab3" active={isActive(3)}>
						Hello Tab Four
					</TabContent>
				]}
			</TabController>
		</div>
	);
});
