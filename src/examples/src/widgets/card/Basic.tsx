import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';

const factory = create();

export default factory(function Basic() {
	return (
		<div styles={{ width: '400px' }}>
			<Card>
				{{
					content: () => (
						<virtual>
							<h2>Hello, World</h2>
							<p>Lorem ipsum</p>
						</virtual>
					)
				}}
			</Card>
		</div>
	);
});
