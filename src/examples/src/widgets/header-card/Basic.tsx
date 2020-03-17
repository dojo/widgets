import { create, tsx } from '@dojo/framework/core/vdom';
import HeaderCard from '@dojo/widgets/header-card';
import Avatar from '@dojo/widgets/avatar';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<HeaderCard
				title="Hello, World"
				subtitle="Lorem ipsum"
				avatar={() => <Avatar>D</Avatar>}
			>
				{{
					content: () => <p>Lorem ipsum</p>
				}}
			</HeaderCard>
		</div>
	);
});
