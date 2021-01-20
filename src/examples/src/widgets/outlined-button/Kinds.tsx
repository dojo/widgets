import { create, tsx } from '@dojo/framework/core/vdom';
import OutlinedButton from '@dojo/widgets/outlined-button';
import Example from '../../Example';

const factory = create();

export default factory(function Kinds() {
	return (
		<Example>
			<div>
				<OutlinedButton kind="primary">Primary</OutlinedButton>
				<br />
				<br />
				<OutlinedButton kind="secondary">Secondary</OutlinedButton>
				<br />
				<br />
				<OutlinedButton kind="cancel">Cancel</OutlinedButton>
				<br />
				<br />
			</div>
		</Example>
	);
});
