import { create, tsx } from '@dojo/framework/core/vdom';
import Rate from '@dojo/widgets/rate';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const maxValue = icache.getOrSet('max-value', 3);
	return (
		<Example>
			<div>
				<Rate key="basic">{{ label: 'How many stars?' }}</Rate>
				<br />
				<Rate
					key="max"
					initialValue={maxValue}
					max={10}
					onValue={(value) => {
						icache.set('max-value', value);
					}}
				>
					{{ label: 'Even more stars and initial value' }}
				</Rate>
				<span>{`${maxValue} out of 10`}</span>
			</div>
		</Example>
	);
});
