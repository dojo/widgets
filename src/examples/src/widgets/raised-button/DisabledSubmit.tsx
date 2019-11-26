import { create, tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '@dojo/widgets/raised-button';

const factory = create();

export default factory(function DisabledSubmitButton() {
	return (
		<RaisedButton type="submit" disabled>
			Submit
		</RaisedButton>
	);
});
