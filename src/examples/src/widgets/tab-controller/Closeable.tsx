import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import { includes } from '@dojo/framework/shim/array';

import TabController from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('active', 0);
	const closedKeys = icache.getOrSet<string[]>('closedKeys', []);
	return (
		<TabController
			activeIndex={activeIndex}
			onRequestTabChange={(index) => {
				icache.set('active', index);
			}}
			onRequestTabClose={(index, key) => {
				icache.set('closedKeys', [...closedKeys, key]);
			}}
		>
			{!includes(closedKeys, 'tab-one') ? (
				<Tab key="tab-one" label="Tab One" closeable={true}>
					Hello Tab One
				</Tab>
			) : null}
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
	);
});
