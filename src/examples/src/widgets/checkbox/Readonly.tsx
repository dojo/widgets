import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';

const factory = create();

export default factory(function Readonly() {
	return (
		<div>
			<Checkbox readOnly>Readonly Checkbox</Checkbox>
			<Checkbox checked readOnly>
				Readonly Checkbox (Checked)
			</Checkbox>
		</div>
	);
});
