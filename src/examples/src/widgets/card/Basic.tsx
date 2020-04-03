import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<Card title="Hello, World">
				{{
					content: <span>Lorem ipsum</span>
				}}
			</Card>
		</div>
	);
});
