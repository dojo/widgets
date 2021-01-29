import { tsx, create } from '@dojo/framework/core/vdom';

import TabContainer from '@dojo/widgets/tab-container';
import Example from '../../Example';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Basic() {
	const tabs = [
		{ name: 'Tab One' },
		{ name: 'Tab Two' },
		{ name: 'Tab Three' },
		{ name: 'Tab Four' }
	];

	return (
		<Example>
			<TabContainer tabs={tabs}>
				<div key="tab0">
					<Button
						onClick={() => {
							console.log('click');
						}}
					>
						Button
					</Button>
				</div>
				<div key="tab1">Hello Tab Two</div>
				<div key="tab2">Hello Tab Three</div>
				<div key="tab3">Hello Tab Four</div>
			</TabContainer>
		</Example>
	);
});
