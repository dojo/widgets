import { tsx, create } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';

import TabController, { Align } from '@dojo/widgets/tab-controller';
import Tab from '@dojo/widgets/tab';
import Select from '@dojo/widgets/select';

const factory = create({ icache });

export default factory(function ButtonAlignment({ middleware: { icache } }) {
	const activeIndex = icache.getOrSet('active', 0);
	const alignButtons = icache.getOrSet<Align>('align', Align.top);
	return (
		<div>
			<Select<{ value: Align; label: string }>
				value={alignButtons}
				getOptionLabel={({ label }) => label}
				getOptionValue={({ value }) => value}
				options={[
					{ value: Align.top, label: 'Top' },
					{ value: Align.left, label: 'Left' },
					{ value: Align.right, label: 'Right' },
					{ value: Align.bottom, label: 'Bottom' }
				]}
				onValue={({ value }) => {
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
