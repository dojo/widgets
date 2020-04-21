import { create, tsx } from '@dojo/framework/core/vdom';
import TwoColumnLayout from '@dojo/widgets/two-column-layout';
import Example from '../../Example';

const factory = create();

export default factory(function TrailingBias() {
	return (
		<Example>
			<TwoColumnLayout bias="trailing">
				{{
					leading: <div styles={{ borderRight: '1px solid black' }}>Leading content</div>,
					trailing: <div styles={{ textAlign: 'center' }}>Expanding trailing content</div>
				}}
			</TwoColumnLayout>
		</Example>
	);
});
