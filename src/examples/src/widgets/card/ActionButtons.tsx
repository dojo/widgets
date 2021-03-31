import { icache } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Card, { Action } from '@dojo/widgets/card';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function ActionButtons({ middleware: { icache } }) {
	const clickCount = icache.getOrSet<number>('clickCount', 0);
	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<Card title="Hello, World">
					{{
						actionButtons: (
							<Action onClick={() => icache.set('clickCount', clickCount + 1)}>
								{clickCount === 0
									? 'Action'
									: `Clicked: ${clickCount} time${clickCount > 1 ? 's' : ''}`}
							</Action>
						),
						content: <span>Lorem ipsum</span>
					}}
				</Card>
			</div>
		</Example>
	);
});
