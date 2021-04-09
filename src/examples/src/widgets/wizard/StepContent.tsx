import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard from '@dojo/widgets/wizard';
import Button from '@dojo/widgets/button';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function StepContent({ middleware: { icache } }) {
	let activeStep = icache.getOrSet('activeStep', 1);
	const steps = [
		{
			title: 'Select an app'
		},
		{
			title: 'Configure analytics for this app'
		},
		{
			title: 'Select an ad format and name ad unit'
		},
		{
			title: 'View setup instructions'
		}
	];

	return (
		<Example>
			<Wizard
				direction="vertical"
				steps={steps}
				activeStep={activeStep}
				onStep={(step) => icache.set('activeStep', step)}
				clickable
			>
				<virtual />
				<div>
					<ExampleContent onContinue={() => icache.set('activeStep', activeStep + 1)} />
				</div>
				<virtual />
				<virtual />
			</Wizard>
		</Example>
	);
});

const exampleFactory = create().properties<{ onContinue: () => void }>();

const ExampleContent = exampleFactory(({ properties }) => (
	<div styles={{ paddingBottom: '16px' }}>
		<div
			styles={{ width: '300px', height: '150px', marginBottom: '8px', background: '#DDD' }}
		/>
		<Button kind="primary" onClick={properties().onContinue}>
			Continue
		</Button>
	</div>
));
