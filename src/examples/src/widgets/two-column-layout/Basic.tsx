import { create, tsx } from '@dojo/framework/core/vdom';
import TwoColumnLayout from '@dojo/widgets/two-column-layout';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<TwoColumnLayout>
				{{
					leading: (
						<div styles={{ textAlign: 'center', borderRight: '1px solid black' }}>
							This is the leading content
						</div>
					),
					trailing: (
						<div styles={{ textAlign: 'center' }}>This is the trailing content</div>
					)
				}}
			</TwoColumnLayout>
		</Example>
	);
});
