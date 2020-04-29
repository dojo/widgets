import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';
const mediaSrc = require('../card/img/card-photo.jpg');
const avatar = require('../avatar/img/dojo.jpg');

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<HeaderCard title="Hello, World" subtitle="Lorem ipsum" mediaSrc={mediaSrc}>
					{{
						avatar: <Avatar src={avatar} />,
						content: <p styles={{ margin: '0' }}>Lorem ipsum</p>
					}}
				</HeaderCard>
			</div>
		</Example>
	);
});
