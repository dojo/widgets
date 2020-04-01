import { create, tsx } from '@dojo/framework/core/vdom';
import TwoColumnLayout from '@dojo/widgets/two-column-layout';

const factory = create();

export default factory(function TrailingBias() {
	return (
		<TwoColumnLayout bias="trailing">
			{{
				leading: <div styles={{ borderRight: '1px solid black' }}>Leading content</div>,
				trailing: <div styles={{ textAlign: 'center' }}>Expanding trailing content</div>
			}}
		</TwoColumnLayout>
	);
});
