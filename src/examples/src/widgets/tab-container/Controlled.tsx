import { tsx, create } from '@dojo/framework/core/vdom';

import TabContainer from '@dojo/widgets/tab-container';
import { icache } from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const tabs = [
		{ name: 'Tab One' },
		{ name: 'Tab Two' },
		{ name: 'Tab Three' },
		{ name: 'Tab Four' }
	];

	return (
		<Example>
			<TabContainer
				activeIndex={icache.getOrSet('activeIndex', 3)}
				onActiveIndex={(index) => icache.set('activeIndex', index)}
				tabs={tabs}
			>
				<div key="tab0">Hello Tab One</div>
				<div key="tab1">Hello Tab Two</div>
				<div key="tab2">Hello Tab Three</div>
				<div key="tab3">Hello Tab Four</div>
			</TabContainer>
		</Example>
	);
});
