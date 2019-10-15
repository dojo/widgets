import { create, tsx } from '@dojo/framework/core/vdom';
import OutlinedButton from '@dojo/widgets/outlined-button';

const factory = create();

export default factory(function Basic() {
	return <OutlinedButton />;
});
