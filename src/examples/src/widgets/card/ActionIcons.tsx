import { create, tsx } from '@dojo/framework/core/vdom';
import Card, { ActionIcon } from '@dojo/widgets/card';
import Example from '../../Example';

const factory = create();

export default factory(function ActionIcons() {
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<Card title="Hello, World">
					{{
						content: <h2>Hello, World</h2>,
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
