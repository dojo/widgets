import { create, tsx } from '@dojo/framework/core/vdom';
import Rate from '@dojo/widgets/rate';
import Example from '../../Example';
import icache from '@dojo/framework/core/middleware/icache';
import Icon from '@dojo/widgets/icon';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	const basicValue = icache.getOrSet('basic-value', 0);
	const maxValue = icache.getOrSet('max-value', 0);
	const lookValue = icache.getOrSet('look-value', 0);
	const halfValue = icache.getOrSet('half-value', 0);
	const halfCustomValue = icache.getOrSet('half-custom-value', 0);
	return (
		<Example>
			<div>
				<Rate
					key="basic"
					onValue={(value) => {
						icache.set('basic-value', value);
					}}
				>
					{{ label: 'How good was that sausage?' }}
				</Rate>
				<span>{`${basicValue} out of 5`}</span>
				<br />
				<Rate
					key="max"
					max={10}
					onValue={(value) => {
						icache.set('max-value', value);
					}}
				>
					{{ label: 'How good was THAT sausage?' }}
				</Rate>
				<span>{`${maxValue} out of 10`}</span>
				<br />
				<Rate
					key="custom"
					onValue={(value) => {
						icache.set('look-value', value);
					}}
				>
					{{
						label: 'How good did that sausage look?',
						icon: <Icon size="medium" type="eyeIcon" />
					}}
				</Rate>
				<span>{`${lookValue} out of 5`}</span>
				<br />
				<Rate
					key="half"
					allowHalf
					onValue={(value) => {
						icache.set('half-value', value);
					}}
				>
					{{
						label: 'What about half a sausage?'
					}}
				</Rate>
				<span>{`${halfValue} out of 5`}</span>
				<br />
				<Rate
					key="half-custom"
					allowHalf
					onValue={(value) => {
						icache.set('half-custom-value', value);
					}}
				>
					{{
						label: 'Any large half questions?',
						icon: <Icon size="large" type="helpIcon" />
					}}
				</Rate>
				<span>{`${halfCustomValue} out of 5`}</span>
			</div>
		</Example>
	);
});
