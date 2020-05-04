import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import SteppedWizard, { Step } from '@dojo/widgets/stepped-wizard';

const factory = create({ icache }).properties();

export default factory(function Vertical({ middleware: { icache } }) {
	const activeStep = icache.getOrSet('activeStep', 0);
	return (
		<Example>
			<SteppedWizard direction="vertical" activeStep={activeStep} numberOfSteps={3}>
				{(statuses) => {
					return statuses.map((status, index) => (
						<Step
							onClick={() => {
								icache.set('activeStep', index);
							}}
							status={status}
							index={index}
						>
							{{
								title: 'Title',
								subTitle: 'SubTitle',
								description: Boolean(index) && 'Description'
							}}
						</Step>
					));
				}}
			</SteppedWizard>
		</Example>
	);
});
