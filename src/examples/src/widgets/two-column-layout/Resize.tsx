import { create, tsx } from '@dojo/framework/core/vdom';
import TwoColumnLayout from '@dojo/widgets/two-column-layout';
import Example from '../../Example';

const factory = create();

export default factory(function Resize() {
	return (
		<Example>
			<div styles={{ height: '500px' }}>
				<TwoColumnLayout resize>
					{{
						leading: (
							<div styles={{ textAlign: 'center' }}>This is the leading content</div>
						),
						trailing: (
							<div styles={{ textAlign: 'center' }}>This is the trailing content</div>
						)
					}}
				</TwoColumnLayout>
			</div>
		</Example>
	);
});
