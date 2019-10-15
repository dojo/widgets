import { create, tsx } from '@dojo/framework/core/vdom';
import ComboBox from '@dojo/widgets/combobox';

const factory = create();

export default factory(function Basic() {
	return <ComboBox label="Combobox" />;
});
