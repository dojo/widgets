import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
const mediaSrc = require('./img/card-photo.jpg');

const factory = create();

export default factory(function CardWithMediaContent() {
	return (
		<div styles={{ width: '400px' }}>
			<Card title="Hello, World" mediaSrc={mediaSrc}>
				{{
					content: () => <span>Lorem ipsum</span>
				}}
			</Card>
		</div>
	);
});
