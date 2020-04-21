import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';
import Example from '../../Example';

const factory = create();

export default factory(function Readonly() {
	return (
		<Example>
			<div>
				<Checkbox readOnly>Readonly Checkbox</Checkbox>
				<Checkbox checked readOnly>
					Readonly Checkbox (Checked)
				</Checkbox>
			</div>
		</Example>
	);
});
