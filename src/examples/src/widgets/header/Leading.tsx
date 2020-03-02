import Header from '@dojo/widgets/header';
import Icon from '@dojo/widgets/icon';
import { Link } from '@dojo/framework/routing/Link';
import { create, tsx } from '@dojo/framework/core/vdom';

const factory = create();

export default factory(function Basic() {
	return (
		<Header>
			{{
				leading: () => <Icon type="barsIcon" />,
				title: () => 'My App',
				actions: () => [
					<Link to="#foo">Foo</Link>,
					<Link to="#bar">Bar</Link>,
					<Link to="#baz">Baz</Link>
				]
			}}
		</Header>
	);
});
