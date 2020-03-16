import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Button from '@dojo/widgets/button';
import Icon from '@dojo/widgets/icon';
const mediaSrc = require('./img/card-photo.jpg');

const factory = create();

export default factory(function CardWithMediaContent() {
	return (
		<div styles={{ width: '400px' }}>
			<Card
				onAction={() => {}}
				mediaSrc={mediaSrc}
				title="Hello, World"
				subtitle="A pretty picture"
			>
				{{
					header: () => <div>Header Content</div>,
					content: () => <p>Travel the world today.</p>,
					actionButtons: () => (
						<virtual>
							<Button>Read</Button>
							<Button>Bookmark</Button>
						</virtual>
					),
					actionIcons: () => (
						<virtual>
							<Icon type="secureIcon" />
							<Icon type="downIcon" />
							<Icon type="upIcon" />
						</virtual>
					)
				}}
			</Card>
		</div>
	);
});
