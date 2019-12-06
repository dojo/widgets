import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';

const factory = create();

export default factory(function Disabled() {
	return (
		<div>
			<Checkbox disabled label="Disabled Checkbox" />
			<Checkbox checked disabled label="Disabled Checkbox (Checked)" />
		</div>
	);
});
