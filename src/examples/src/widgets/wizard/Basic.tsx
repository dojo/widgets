import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step, StepItem } from '@dojo/widgets/wizard';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Basic({ middleware: { icache } }) {
	let activeStep = icache.getOrSet('activeStep', 1);
	let steps = icache.getOrSet<StepItem[]>('steps', [
		{ status: 'complete' },
		{ status: 'inProgress' },
		{ status: 'pending' }
	]);
	return (
		<Example>
			<Wizard
				steps={steps}
				onStep={(stepIndex) => {
					icache.set('activeStep', stepIndex);
					icache.set(
						'steps',
						steps.map(({ status }, index) => {
							if (status === 'error') {
								return { status };
							} else if (index < stepIndex) {
								return { status: 'complete' };
							} else if (index === stepIndex) {
								return { status: 'inProgress' };
							} else {
								return { status: 'pending' };
							}
						})
					);
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
						activeStep = Math.max(activeStep - 1, -1);
						icache.set(
							'steps',
							steps.map(({ status }, index) => {
								if (status === 'error') {
									return { status };
								} else if (index < activeStep) {
									return { status: 'complete' };
								} else if (index === activeStep) {
									return { status: 'inProgress' };
								} else {
									return { status: 'pending' };
								}
							})
						);
						icache.set('activeStep', activeStep);
					}}
				>
					Prev
				</Button>
				<Button
					onClick={() => {
						activeStep = Math.min(activeStep + 1, steps.length);
						icache.set(
							'steps',
							steps.map(({ status }, index) => {
								if (status === 'error') {
									return { status };
								} else if (index < activeStep) {
									return { status: 'complete' };
								} else if (index === activeStep) {
									return { status: 'inProgress' };
								} else {
									return { status: 'pending' };
								}
							})
						);
						icache.set('activeStep', activeStep);
					}}
				>
					Next
				</Button>
			</div>
		</Example>
	);
});
