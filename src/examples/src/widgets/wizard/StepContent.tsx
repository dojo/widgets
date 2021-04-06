import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard from '@dojo/widgets/wizard';
import Button from '@dojo/widgets/button';

export default create()(function StepContent() {
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
			<Wizard direction="vertical" steps={steps}>
				<virtual />
				<div>
					<ExampleContent />
				</div>
				<virtual />
				<virtual />
			</Wizard>
		</Example>
	);
});

const ExampleContent = create()(() => (
	<div styles={{ paddingBottom: '16px' }}>
		<div
			styles={{ width: '300px', height: '150px', marginBottom: '8px', background: '#DDD' }}
		/>
		<Button kind="primary">Continue</Button>
		<Button>Cancel</Button>
	</div>
));
