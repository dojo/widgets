import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Icon from '@dojo/widgets/icon';
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
								<Icon type="secureIcon" />
								<Icon type="downIcon" />
								<Icon type="upIcon" />
							</virtual>
						)
					}}
				</Card>
			</div>
		</Example>
	);
});
