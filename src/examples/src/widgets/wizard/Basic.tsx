import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step } from '@dojo/widgets/wizard';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Basic({ middleware: { icache } }) {
	let activeStep = icache.getOrSet('activeStep', 1);
	return (
		<Example>
			<Wizard
				clickable
				activeStep={activeStep}
				onStep={(stepIndex) => {
					icache.set('activeStep', stepIndex);
				}}
			>
				<Step />
				<Step>
					{{
						title: 'Title',
						subTitle: 'SubTitle'
					}}
				</Step>
				<Step>
					{{
						title: 'Title',
						subTitle: 'SubTitle',
						description: 'This is a description'
					}}
				</Step>
			</Wizard>
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
