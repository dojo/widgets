import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard, { Step } from '@dojo/widgets/wizard';

const factory = create().properties();

export default factory(function Error() {
	return (
		<Example>
			<Wizard steps={[{ status: 'complete' }, { status: 'error' }, { status: 'pending' }]}>
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
