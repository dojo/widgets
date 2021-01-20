import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard from '@dojo/widgets/wizard';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Custom({ middleware: { icache } }) {
	const steps = [
		{
			title: 'Complete'
		},
		{
			title: 'In Progress'
		},
		{
			title: 'Pending'
		}
	];
	return (
		<Example>
			<Wizard clickable activeStep={1} steps={steps}>
				{{
					step: (status, index, step) => {
						let icon;
						switch (status) {
							case 'complete':
								icon = '⊛';
								break;
							case 'inProgress':
								icon = '⌾';
								break;
							case 'pending':
								icon = '⃝';
								break;
						}
						return (
							<div>
								{icon} {step.title || ''}
							</div>
						);
					}
				}}
			</Wizard>
		</Example>
	);
});
