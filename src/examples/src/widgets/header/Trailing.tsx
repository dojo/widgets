import Header from '@dojo/widgets/header';
import Icon from '@dojo/widgets/icon';
import { Link } from '@dojo/framework/routing/Link';
import { create, tsx } from '@dojo/framework/core/vdom';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Header>
				{{
					title: 'My App',
					actions: [
						<Link to="#foo">Foo</Link>,
						<Link to="#bar">Bar</Link>,
						<Link to="#baz">Baz</Link>
					],
					trailing: <Icon type="searchIcon" />
				}}
			</Header>
		</Example>
	);
});
