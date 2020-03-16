import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Card from '@dojo/widgets/card';
import Button from '@dojo/widgets/button';
import Icon from '@dojo/widgets/icon';

const factory = create({ icache });

export default factory(function ActionButtonsAndIcons({ middleware: { icache } }) {
	const clickCount = icache.getOrSet<number>('clickCount', 0);
	return (
		<div styles={{ width: '400px' }}>
			<Card title="Hello, World">
				{{
					content: () => <p>Lorem ipsum</p>,
					actionButtons: () => (
						<Button onClick={() => icache.set('clickCount', clickCount + 1)}>
							{clickCount === 0
								? 'Action'
								: `Clicked: ${clickCount} time${clickCount > 1 ? 's' : ''}`}
						</Button>
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
