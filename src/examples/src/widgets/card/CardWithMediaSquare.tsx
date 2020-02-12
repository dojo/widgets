import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import mediaSrc from './img/card-photo.jpg';

const factory = create();

export default factory(function CardWithMediaSquare() {
	return (
		<div styles={{ width: '200px' }}>
			<Card square mediaSrc={mediaSrc}>
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
