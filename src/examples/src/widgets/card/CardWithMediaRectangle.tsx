import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
const mediaSrc = require('./img/card-photo.jpg');

const factory = create();

export default factory(function CardWithMediaRectangle() {
	return (
		<div styles={{ width: '400px' }}>
			<Card mediaSrc={mediaSrc} title="Hello, World" subtitle="Lorem ipsum">
				{{
					content: <span>Content goes here.</span>
				}}
			</Card>
		</div>
	);
});
