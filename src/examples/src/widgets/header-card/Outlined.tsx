import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';
import Example from '../../Example';

const factory = create();

export default factory(function Outlined() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<HeaderCard outlined title="Hello, World" subtitle="Lorem ipsum">
					{{
						avatar: <Avatar>D</Avatar>,
						content: <p styles={{ margin: '0' }}>Lorem ipsum</p>
					}}
				</HeaderCard>
			</div>
		</Example>
	);
});
