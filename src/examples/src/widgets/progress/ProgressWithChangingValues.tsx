import { create, tsx } from '@dojo/framework/core/vdom';
import { icache } from '@dojo/framework/core/middleware/icache';
import Progress from '@dojo/widgets/progress';
import Button from '@dojo/widgets/button';

const factory = create({ icache });

export default factory(function ProgressWithChangingvalues({ middleware: { icache } }) {
	const max = 100;
	const step = 10;
	const value = icache.getOrSet<number>('value', 0);
	return (
		<div>
			<Progress value={value} max={max} />
			<div>
				<Button onClick={() => icache.set('value', value - step < 0 ? 0 : value - step)}>
					Decrease
				</Button>
				<Button
					onClick={() => icache.set('value', value + step > max ? max : value + step)}
				>
					Increase
				</Button>
			</div>
		</div>
	);
});
