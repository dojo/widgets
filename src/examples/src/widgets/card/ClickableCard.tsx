import icache from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import Card from '@dojo/widgets/card';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function ClickableCard({ middleware: { icache } }) {
	const clickable = icache.getOrSet<number>('clickable', 0);

	return (
		<Example>
			<div styles={{ maxWidth: '400px' }}>
				<Card
					title="Hello, World"
					onClick={() => {
						icache.set('clickable', icache.getOrSet<number>('clickable', 0) + 1);
					}}
				>
					{{
						content: <span>Lorem ipsum</span>
					}}
				</Card>
			</div>
			<div>Clicked {String(clickable)} times</div>
		</Example>
	);
});
