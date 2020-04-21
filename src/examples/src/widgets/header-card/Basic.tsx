import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Basic() {
	return (
		<Example>
			<div styles={{ width: '400px' }}>
				<HeaderCard title="Hello, World" subtitle="Lorem ipsum">
					{{
						avatar: <Avatar>D</Avatar>,
						content: <p styles={{ margin: '0' }}>Lorem ipsum</p>
					}}
				</HeaderCard>
			</div>
		</Example>
	);
});
