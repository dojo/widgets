import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';

const factory = create();

export default factory(function Disabled() {
	return (
		<div>
			<Checkbox disabled>Disabled Checkbox</Checkbox>
			<Checkbox checked disabled>
				Disabled Checkbox (Checked)
			</Checkbox>
		</div>
	);
});
