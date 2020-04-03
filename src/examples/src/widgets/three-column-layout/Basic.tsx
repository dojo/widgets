import { create, tsx } from '@dojo/framework/core/vdom';
import ThreeColumnLayout from '@dojo/widgets/three-column-layout';

const factory = create();

export default factory(function Basic() {
	return (
		<ThreeColumnLayout>
			{{
				leading: <div>This is the leading content</div>,
				center: <div>This is the center content</div>,
				trailing: <div>This is the trailing content</div>
			}}
		</ThreeColumnLayout>
	);
});
