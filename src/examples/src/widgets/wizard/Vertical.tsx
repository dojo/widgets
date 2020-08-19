import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step, StepStatus } from '@dojo/widgets/wizard';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Vertical({ middleware: { icache } }) {
	let steps = icache.getOrSet<StepStatus[]>('steps', ['complete', 'inProgress', 'pending']);
	return (
		<Example>
			<Wizard
				onStep={(stepIndex) => {
					icache.set(
						'steps',
						steps.map((_, index) => {
							if (index < stepIndex) {
								return { status: 'complete' };
							} else if (index === stepIndex) {
								return { status: 'inProgress' };
							} else {
								return { status: 'pending' };
							}
						})
					);
				}}
				direction="vertical"
			>
				<Step status={steps[0]}>
					{{
						title: 'Title',
						subTitle: 'SubTitle'
					}}
				</Step>
				<Step status={steps[1]}>
					{{
						title: 'Title',
						subTitle: 'SubTitle',
						description: 'This is a description'
					}}
				</Step>
				<Step status={steps[2]}>
					{{
						title: 'Title',
						subTitle: 'SubTitle',
						description: 'Description'
					}}
				</Step>
			</Wizard>
		</Example>
	);
});
