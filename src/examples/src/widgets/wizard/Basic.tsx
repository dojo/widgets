import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard from '@dojo/widgets/wizard';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Basic({ middleware: { icache } }) {
	let activeStep = icache.getOrSet('activeStep', 1);
	const steps = [
		{},
		{
			title: 'Title',
			subTitle: 'SubTitle'
		},
		{
			title: 'Title',
			subTitle: 'SubTitle',
			description: 'This is a description'
		}
	];
	return (
		<Example>
			<Wizard
				clickable
				activeStep={activeStep}
				onStep={(stepIndex) => {
					icache.set('activeStep', stepIndex);
				}}
				steps={steps}
			/>
			<div>
				<Button
					onClick={() => {
						icache.set('activeStep', Math.max(activeStep - 1, -1));
					}}
				>
					Prev
				</Button>
				<Button
					onClick={() => {
						icache.set('activeStep', Math.min(activeStep + 1, 3));
					}}
				>
					Next
				</Button>
			</div>
		</Example>
	);
});
