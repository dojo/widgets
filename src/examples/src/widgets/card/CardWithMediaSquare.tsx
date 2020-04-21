import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Example from '../../Example';
const mediaSrc = require('./img/card-photo.jpg');

const factory = create();

export default factory(function CardWithMediaSquare() {
	return (
		<Example>
			<div styles={{ width: '200px' }}>
				<Card title="Hello, World" square mediaSrc={mediaSrc}>
					{{
						content: <span>Lorem ipsum</span>
					}}
				</Card>
			</div>
		</Example>
	);
});
