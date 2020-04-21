import { create, tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '@dojo/widgets/raised-button';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<RaisedButton>Raised Button</RaisedButton>
		</Example>
	);
});
