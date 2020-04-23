import { tsx, create } from '@dojo/framework/core/vdom';

import TabContainer from '@dojo/widgets/tab-container';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

const tabs = [
	{ closeable: true, name: 'Tab One' },
	{ name: 'Tab Two' },
	{ closeable: true, name: 'Tab Three' },
	{ name: 'Tab Four' }
];

const tabContents = [
	<div key="tab0">Hello Tab One</div>,
	<div key="tab1">Hello Tab Two</div>,
	<div key="tab2">Hello Tab Three</div>,
	<div key="tab3">Hello Tab Four</div>
];

export default factory(function Closeable({ middleware: { icache } }) {
	const closedTabs = icache.getOrSet('closedTabs', new Set<number>());

	const filteredTabs = tabs.filter((tab, index) => !closedTabs.has(index));
	const filteredContents = tabContents.filter((tab, index) => !closedTabs.has(index));

	function closeTab(index: number) {
		const closedTabs = icache.getOrSet('closedTabs', new Set<number>());
		icache.set('closedTabs', closedTabs.add(index));
	}

	return (
		<Example>
			<TabContainer tabs={filteredTabs} onClose={closeTab}>
				{...filteredContents}
			</TabContainer>
		</Example>
	);
});
