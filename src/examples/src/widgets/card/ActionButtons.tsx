import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Card from '@dojo/widgets/card';
import Button from '@dojo/widgets/button';

const factory = create({ icache });

export default factory(function ActionButtons({ middleware: { icache } }) {
	const clickCount = icache.getOrSet<number>('clickCount', 0);
	return (
		<div styles={{ width: '400px' }}>
			<Card title="Hello, World">
				{{
					actionButtons: () => (
						<Button onClick={() => icache.set('clickCount', clickCount + 1)}>
							{clickCount === 0
								? 'Action'
								: `Clicked: ${clickCount} time${clickCount > 1 ? 's' : ''}`}
						</Button>
					),
					content: () => <p>Lorem ipsum</p>
				}}
			</Card>
		</div>
	);
});
