import Header from '@dojo/widgets/header';
import { Link } from '@dojo/framework/routing/Link';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function Basic() {
	return (
		<Header>
			{{
				actionsRenderer: () => [
					<Link to="#foo">Foo</Link>,
					<Link to="#bar">Bar</Link>,
					<Link to="#baz">Baz</Link>
				],
				titleRenderer: () => 'My App'
			}}
		</Header>
	);
});
