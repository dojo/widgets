import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step, StepItem } from '@dojo/widgets/wizard';
import { icache } from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Vertical({ middleware: { icache } }) {
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
				<Step>
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
