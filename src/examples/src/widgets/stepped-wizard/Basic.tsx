import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import SteppedWizard, { Step } from '@dojo/widgets/stepped-wizard';

const factory = create({ icache }).properties();

export default factory(function Basic({ middleware: { icache } }) {
	const activeStep = icache.getOrSet('activeStep', 0);
	return (
		<Example>
			<SteppedWizard activeStep={activeStep} numberOfSteps={5}>
				{(statuses) => {
					return statuses.map((status, index) => (
						<Step
							onClick={() => {
								icache.set('activeStep', index);
							}}
							status={status}
							index={index}
						/>
					));
				}}
			</SteppedWizard>
		</Example>
	);
});
