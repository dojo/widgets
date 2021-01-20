import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';
import Wizard from '@dojo/widgets/wizard';

const factory = create().properties();

export default factory(function Error() {
	return (
		<Example>
			<Wizard
				steps={[
					{
						status: 'complete'
					},
					{
						status: 'error',
						title: 'Title',
						subTitle: 'SubTitle'
					},
					{
						status: 'pending',
						title: 'Title',
						subTitle: 'SubTitle',
						description: 'Description'
					}
				]}
			/>
		</Example>
	);
});
