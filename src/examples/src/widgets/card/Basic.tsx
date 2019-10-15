import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';

const factory = create();

export default factory(function Basic() {
	return (
		<Card>
			<h1>Hello, World</h1>
			<p>Lorem ipsum</p>
		</Card>
	);
});
