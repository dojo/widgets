import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
const mediaSrc = require('./img/card-photo.jpg');

const factory = create();

export default factory(function CardWithMediaSquare() {
	return (
		<div styles={{ width: '200px' }}>
			<Card title="Hello, World" square mediaSrc={mediaSrc}>
				{{
					content: () => <p>Lorem ipsum</p>
				}}
			</Card>
		</div>
	);
});
