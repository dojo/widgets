import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import theme from '../middleware/theme';
import Calendar from '../calendar';
import TextInput from '../text-input';
import Icon from '@dojo/widgets/icon';
import Popup from '../popup';
import * as css from '../theme/default/date-input.m.css';
import HelperText from '../helper-text';

export interface DateInputProperties {
	/** Sets the helper text of the input */
	helperText?: string;
	/** The current value */
	initialValue?: Date;
	/** Set the latest date the calendar will display (it will show the whole month but not allow later selections) */
	max?: Date;
	/** Set the earliest date the calendar will display (it will show the whole month but not allow previous selections) */
	min?: Date;
	/** Callback fired when the input value changes */
	onValue?(date: Date): void;
}

interface DateInputICache {
	date: Date;
	month: number;
	year: number;
}

const icache = createICacheMiddleware<DateInputICache>();
const factory = create({ theme, icache }).properties<DateInputProperties>();

export default factory(function({ properties, middleware: { theme, icache } }) {
	const { max, min, onValue, initialValue = new Date(), helperText } = properties();
	const classes = theme.classes(css);
	const date = icache.getOrSet('date', initialValue);
	const month = icache.getOrSet('month', initialValue.getMonth());
	const year = icache.getOrSet('year', initialValue.getFullYear());

	const formatDate = () => {
		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date
			.getDate()
			.toString()
			.padStart(2, '0');

		return `${year}-${month}-${day}`;
	};

	return (
		<div classes={classes.root}>
			<Popup>
				{{
					trigger: (toggleOpen) => {
						function openCalendar() {
							// todo: focus calendar popup instead of text-input
							toggleOpen();
						}

						return (
							<div classes={classes.input}>
								<TextInput
									onClick={openCalendar}
									onFocus={openCalendar}
									trailing={() => (
										<div onclick={openCalendar}>
											<Icon type="dateIcon" />
										</div>
									)}
									type="text"
									value={formatDate()}
								/>
							</div>
						);
					},
					content: (onClose) => {
						function closePopup() {
							onClose();
						}

						return (
							<div classes={classes.popup}>
								<Calendar
									maxDate={max}
									minDate={min}
									month={month}
									onDateSelect={(date) => {
										icache.set('date', date);
										if (onValue) {
											onValue(date);
										}
										closePopup();
									}}
									onMonthChange={(month) => icache.set('month', month)}
									onYearChange={(year) => icache.set('year', year)}
									selectedDate={date}
									year={year}
								/>
							</div>
						);
					}
				}}
			</Popup>
			<HelperText key={helperText} text={helperText} />
		</div>
	);
});
