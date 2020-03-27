import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TabController, { Align } from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';
import Select, { defaultTransform } from '@dojo/widgets/select';
import { createResource } from '@dojo/framework/core/resource';
import { createMemoryTemplate } from '../list/memoryTemplate';

const factory = create({ icache });
const memoryTemplate = createMemoryTemplate();

export default factory(function ButtonAlignment({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('active', 0);
	const alignButtons = icache.getOrSet('align', Align.top);
	return (
		<div>
			<Select
				initialValue={alignButtons}
				resource={{
					resource: () => createResource(memoryTemplate),
					data: [
						{ value: Align.top, label: 'Top' },
						{ value: Align.left, label: 'Left' },
						{ value: Align.right, label: 'Right' },
						{ value: Align.bottom, label: 'Bottom' }
					]
				}}
				transform={defaultTransform}
				onValue={(value) => {
					icache.set('align', value);
				}}
			/>
			<TabController
				activeIndex={activeIndex}
				alignButtons={alignButtons}
				onRequestTabChange={(index) => {
					icache.set('active', index);
				}}
			>
				<Tab key="tab-one" label="Tab One">
					Hello Tab One
				</Tab>
				<Tab key="tab-two" label="Tab Two">
					Hello Tab Two
				</Tab>
				<Tab key="tab-three" label="Tab Three">
					Hello Tab Three
				</Tab>
				<Tab key="tab-four" label="Tab Four">
					Hello Tab Four
				</Tab>
			</TabController>
		</div>
	);
});
