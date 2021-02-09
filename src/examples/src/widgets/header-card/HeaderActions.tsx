import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';
import Button from '@dojo/widgets/button';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function HeaderActions() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<HeaderCard title="Hello, World" subtitle="Lorem ipsum">
					{{
						avatar: <Avatar>D</Avatar>,
						headerActions: (
							<Button>
								<Icon type="editIcon" />
							</Button>
						),
						content: <p styles={{ margin: '0' }}>Lorem ipsum</p>
					}}
				</HeaderCard>
			</div>
		</Example>
	);
});
