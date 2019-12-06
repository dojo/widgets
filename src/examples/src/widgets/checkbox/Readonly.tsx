import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';

const factory = create();

export default factory(function Readonly() {
	return (
		<div>
			<Checkbox readOnly label="Readonly Checkbox" />
			<Checkbox checked readOnly label="Readonly Checkbox (Checked)" />
		</div>
	);
});
