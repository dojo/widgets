import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import mediaSrc from './img/card-photo.jpg';
import Button from '@dojo/widgets/button';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function CardWithMediaContent() {
	return (
		<div styles={{ width: '400px' }}>
			<Card mediaSrc={mediaSrc}>
				{{
					header: () => (
						<virtual>
							<h2>Our Changing Planet</h2>
							<h3>by Kurt Wagner</h3>
						</virtual>
					),
					content: () => (
						<p>
							Visit ten places on our planet that are undergoing the biggest changes
							today.
						</p>
					),
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
