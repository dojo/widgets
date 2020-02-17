import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
const mediaSrc = require('../card/img/card-photo.jpg');
const avatar = require('../avatar/img/dojo.jpg');

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<HeaderCard
				avatar={() => <Avatar src={avatar} />}
				title="Hello, World"
				subtitle="Lorem ipsum"
				mediaSrc={mediaSrc}
			>
				{{
					content: () => <p>Lorem ipsum</p>
				}}
			</HeaderCard>
		</div>
	);
});
