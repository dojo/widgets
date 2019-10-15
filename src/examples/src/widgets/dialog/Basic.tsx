import { create, tsx } from '@dojo/framework/core/vdom';
import Dialog from '@dojo/widgets/dialog';

const factory = create();

export default factory(function Basic() {
	return <Dialog />;
});
