import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function ActionIcons() {
	return (
		<div styles={{ width: '400px' }}>
			<Card title="Hello, World">
				{{
					content: <h2>Hello, World</h2>,
					actionIcons: (
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
