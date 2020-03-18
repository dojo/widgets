import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
import Button from '@dojo/widgets/button';
import Icon from '@dojo/widgets/icon';
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
					content: () => <p styles={{ margin: '0' }}>Lorem ipsum</p>,
					actionButtons: () => <Button>Action</Button>,
					actionIcons: () => (
						<virtual>
							<Icon type="upIcon" />
							<Icon type="downIcon" />
						</virtual>
					)
				}}
			</HeaderCard>
		</div>
	);
});
