import { create, tsx } from '@dojo/framework/core/vdom';
import Checkbox from '@dojo/widgets/checkbox';
import Example from '../../Example';

const factory = create();

export default factory(function Readonly() {
	return (
		<Example>
			<div>
				<Checkbox checked={false} onValue={() => {}} readOnly>
					Readonly Checkbox
				</Checkbox>
				<Checkbox checked readOnly onValue={() => {}}>
					Readonly Checkbox (Checked)
				</Checkbox>
			</div>
		</Example>
	);
});
