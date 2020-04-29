import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';
import Example from '../../Example';

const factory = create();

export default factory(function Disabled() {
	return (
		<Example>
			<div>
				<Checkbox checked={false} disabled onValue={() => {}}>
					Disabled Checkbox
				</Checkbox>
				<Checkbox checked disabled onValue={() => {}}>
					Disabled Checkbox (Checked)
				</Checkbox>
			</div>
		</Example>
	);
});
