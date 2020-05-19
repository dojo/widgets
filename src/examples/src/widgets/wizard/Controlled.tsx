import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import Example from '../../Example';
import Wizard, { Step } from '@dojo/widgets/wizard';

const factory = create({ icache }).properties();

export default factory(function Controlled({ middleware: { icache } }) {
	const activeStep = icache.getOrSet('activeStep', 0);
	return (
		<Example>
			<Wizard
				activeStep={activeStep}
				onActiveStep={(index) => {
					icache.set('activeStep', index);
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
						description: 'Description'
					}}
				</Step>
			</Wizard>
		</Example>
	);
});
