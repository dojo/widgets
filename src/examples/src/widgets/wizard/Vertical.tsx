import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { StepStatus } from '@dojo/widgets/wizard';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Vertical({ middleware: { icache } }) {
	let statuses = icache.getOrSet<StepStatus[]>('statuses', ['complete', 'inProgress', 'pending']);
	const steps = [
		{
			status: statuses[0],
			title: 'Title',
			subTitle: 'SubTitle'
		},
		{
			status: statuses[1],
			title: ' Title',
			subTitle: 'SubTitle',
			description: 'This is a description'
		},
		{
			status: statuses[2],
			title: 'Title',
			subTitle: 'SubTitle',
			description: 'Description'
		}
	];

	return (
		<Example>
			<Wizard
				onStep={(stepIndex) => {
					icache.set('statuses', (statuses: StepStatus[]) =>
						statuses.map((_, index) => {
							if (index < stepIndex) {
								return 'complete';
							} else if (index === stepIndex) {
								return 'inProgress';
							} else {
								return 'pending';
							}
						})
					);
				}}
				direction="vertical"
				steps={steps}
				clickable
			/>
		</Example>
	);
});
