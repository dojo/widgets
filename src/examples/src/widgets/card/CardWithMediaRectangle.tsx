import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import mediaSrc from './img/card-photo.jpg';

const factory = create();

export default factory(function CardWithMediaRectangle() {
	return (
		<div styles={{ width: '400px' }}>
			<Card mediaSrc={mediaSrc}>
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
