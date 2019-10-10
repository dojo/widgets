import { create, tsx } from '@dojo/framework/core/vdom';
import Select from '@dojo/widgets/select';

const factory = create();

export default factory(function Basic() {
	return <Select />;
});
