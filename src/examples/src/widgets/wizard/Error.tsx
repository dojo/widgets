import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step } from '@dojo/widgets/wizard';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache }).properties();

export default factory(function Error({ middleware: { icache } }) {
	const activeStep = icache.getOrSet('activeStep', 1);
	return (
		<Example>
			<Wizard
				onActiveStep={(index) => {
					icache.set('activeStep', index);
				}}
				initialActiveStep={1}
				error={activeStep === 1}
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
