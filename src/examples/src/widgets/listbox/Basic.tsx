import { create, tsx } from '@dojo/framework/core/vdom';
import Listbox from '@dojo/widgets/listbox';

const factory = create();

export default factory(function Basic() {
	return <Listbox />;
});
