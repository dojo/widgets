import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import DateInput from '@dojo/widgets/date-input';
import Example from '../../Example';

const factory = create({ icache });

export default factory(function Basic({ middleware: { icache } }) {
	return (
		<Example>
			<div>
				<div>{icache.get('date')}</div>
				<DateInput
					name="dateInput"
					onValue={(value) => {
						icache.set('date', value);
					}}
					dateParser={(input?: string) => {
						if (!input) {
							return undefined;
						}
						const parts = input.split('#');
						if (
							parts.length === 3 &&
							parts.every((part) => Number.isInteger(Number(part)))
						) {
							return new Date(
								Number(parts[0]),
								Number(parts[1]) - 1,
								Number(parts[2])
							);
						}
					}}
					dateFormatter={(input?: Date) => {
						if (!input || isNaN(input.valueOf())) {
							return undefined;
						}
						return [input.getFullYear(), input.getMonth() + 1, input.getDate()].join(
							'#'
						);
					}}
				/>
			</div>
		</Example>
	);
});
