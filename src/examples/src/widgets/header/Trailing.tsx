import { create, tsx } from '@dojo/framework/core/vdom';
import Header, { Action } from '@dojo/widgets/header';
import Icon from '@dojo/widgets/icon';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<Header>
				{{
					title: 'My App',
					actions: [
						<Action to="#foo">Foo</Action>,
						<Action to="#bar">Bar</Action>,
						<Action to="#baz">Baz</Action>
					],
					trailing: <Icon type="searchIcon" />
				}}
			</Header>
		</Example>
	);
});
