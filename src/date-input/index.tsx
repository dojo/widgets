import { create, tsx } from '@dojo/framework/core/vdom';
import icache from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import Calendar from '../calendar';
import TextInput from '../text-input';
import Icon from '@dojo/widgets/icon';
import Popup from '../popup';
import * as css from '../theme/default/date-input.m.css';

export interface DateInputProperties {
	/** Set the latest date the calendar will display (it will show the whole month but not allow later selections) */
	maxDate?: Date;
	/** Set the earliest date the calendar will display (it will show the whole month but not allow previous selections) */
	minDate?: Date;
	/** Callback fired when the input value changes */
	onValue?(date: Date): void;
	/** The current value */
	value?: Date;
}

const factory = create({ theme, icache }).properties<DateInputProperties>();

export default factory(function({ properties, middleware: { theme, icache } }) {
	const { minDate, maxDate, onValue, value = new Date() } = properties();
	const classes = theme.classes(css);
	const month = icache.getOrSet('month', value.getMonth());
	const year = icache.getOrSet('year', value.getFullYear());

	const formatDate = () => {
		const year = value.getFullYear();
		const month = value.getMonth() + 1;
		const day = value
			.getDate()
			.toString()
			.padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	return (
		<div classes={[classes.root]}>
			<Popup>
				{{
					trigger: (onToggleOpen) => (
						<TextInput
							type="date"
							value={formatDate()}
							onClick={onToggleOpen}
							trailing={() => (
								<div onclick={onToggleOpen}>
									<Icon type="dateIcon" />
								</div>
							)}
						/>
					),
					content: (onClose) => (
						<div classes={[classes.popup]}>
							<Calendar
								selectedDate={value}
								month={month}
								year={year}
								onDateSelect={(date) => {
									icache.set('date', date);
									if (onValue) {
										onValue(date);
									}
									onClose();
								}}
								onMonthChange={(month) => icache.set('month', month)}
								onYearChange={(year) => icache.set('year', year)}
								minDate={minDate}
								maxDate={maxDate}
							/>
						</div>
					)
				}}
			</Popup>
		</div>
	);
});
