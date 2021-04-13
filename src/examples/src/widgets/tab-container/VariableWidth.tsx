import { tsx, create } from '@dojo/framework/core/vdom';

import TabContainer from '@dojo/widgets/tab-container';
import Example from '../../Example';
import Button from '@dojo/widgets/button';

const factory = create();

export default factory(function Basic() {
	const tabs = [
		{ name: 'One' },
		{ name: 'Tab Two' },
		{ name: 'Long Tab Three' },
		{ name: 'Tab Four Beyond Max Length Causing Ellipsis' }
	];

	return (
		<Example>
			<TabContainer tabs={tabs} fixed={false}>
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
