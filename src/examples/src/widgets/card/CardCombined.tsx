import { create, tsx } from '@dojo/framework/core/vdom';
import Card, { Action, ActionIcon } from '@dojo/widgets/card';
import Example from '../../Example';
const mediaSrc = require('./img/card-photo.jpg');

const factory = create();

export default factory(function CardWithMediaContent() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<Card
					onAction={() => {}}
					mediaSrc={mediaSrc}
					title="Hello, World"
					subtitle="A pretty picture"
				>
					{{
						header: <div>Header Content</div>,
						content: <span>Travel the world today.</span>,
						actionButtons: (
							<virtual>
								<Action>Read</Action>
								<Action>Bookmark</Action>
							</virtual>
						),
						actionIcons: (
							<virtual>
								<ActionIcon type="secureIcon" />
								<ActionIcon type="downIcon" />
								<ActionIcon type="upIcon" />
							</virtual>
						)
					}}
				</Card>
			</div>
		</Example>
	);
});
