import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Icon from '@dojo/widgets/icon';

const factory = create();

export default factory(function ActionIcons() {
	return (
		<div styles={{ width: '400px' }}>
			<Card>
				{{
					content: () => (
						<virtual>
							<h2>Hello, World</h2>
							<p>Lorem ipsum</p>
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
