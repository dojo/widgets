import { create, tsx } from '@dojo/framework/core/vdom';
import RaisedButton from '@dojo/widgets/raised-button';
import Example from '../../Example';

const factory = create();

export default factory(function Kinds() {
	return (
		<Example>
			<div>
				<RaisedButton kind="primary">Primary</RaisedButton>
				<br />
				<br />
				<RaisedButton kind="secondary">Secondary</RaisedButton>
				<br />
				<br />
				<RaisedButton kind="default">Default</RaisedButton>
			</div>
		</Example>
	);
});
