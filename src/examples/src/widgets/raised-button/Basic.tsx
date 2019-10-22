import { create, tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '@dojo/widgets/raised-button';

const factory = create();

export default factory(function Basic() {
	return <RaisedButton>Raised Button</RaisedButton>;
});
