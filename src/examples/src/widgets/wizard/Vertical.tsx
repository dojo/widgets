import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step } from '@dojo/widgets/wizard';

const factory = create().properties();

export default factory(function Vertical() {
	return (
		<Example>
			<Wizard initialActiveStep={0} direction="vertical">
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
