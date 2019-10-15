import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TabController from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('active', 0);
	return (
		<TabController
			activeIndex={activeIndex}
			onRequestTabChange={(index) => {
				icache.set('active', index);
			}}
		>
			<Tab key="tab-one" disabled={true} label="Tab One">
				Hello Tab One
			</Tab>
			<Tab key="tab-two" label="Tab Two">
				Hello Tab Two
			</Tab>
			<Tab key="tab-three" disabled={true} label="Tab Three">
				Hello Tab Three
			</Tab>
			<Tab key="tab-four" label="Tab Four">
				Hello Tab Four
			</Tab>
		</TabController>
	);
});
