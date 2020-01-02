import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { parseDate } from '../calendar/date-utils';
import theme from '../middleware/theme';
import Calendar from '../calendar';
import TextInput from '../text-input';
import Icon from '../icon';
import Popup from '../popup';
import * as css from '../theme/default/date-input.m.css';
import bundle from './nls/DateInput';

export interface DateInputProperties {
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
	/** Current input value */
	value: string;
	/** The last valid Date of value */
	date: Date;
	/** Month of the popup calendar */
	month: number;
	/** Year of the popup calendar */
	year: number;
	/** Should validate the input value on the next cycle */
	shouldValidate: boolean;
	/** Message for current validation state */
	validationMessages: string[];
}

const icache = createICacheMiddleware<DateInputICache>();
const factory = create({ theme, icache, i18n }).properties<DateInputProperties>();
const formatDate = (date: Date) => {
	return Intl.DateTimeFormat().format(date);
};

export default factory(function({ properties, middleware: { theme, icache, i18n } }) {
	const { max, min, onValue, initialValue = new Date() } = properties();
	const { messages } = i18n.localize(bundle);
	const classes = theme.classes(css);

	const value = icache.getOrSet('value', formatDate(initialValue));
	const shouldValidate = icache.getOrSet('shouldValidate', true);

	if (shouldValidate) {
		let validationMessages: string[] = [];

		if (min && max && min > max) {
			// if min & max create an impossible range, no need to validate anything else
			validationMessages.push(messages.invalidProps);
		} else {
			const newDate = parseDate(value);

			if (newDate !== undefined) {
				if (min && newDate < min) {
					validationMessages.push(messages.tooEarly);
				} else if (max && newDate > max) {
					validationMessages.push(messages.tooLate);
				} else {
					icache.set('date', newDate);
					icache.set('month', newDate.getMonth());
					icache.set('year', newDate.getFullYear());
					icache.set('value', formatDate(newDate));
					if (onValue) {
						onValue(newDate);
					}
				}
			} else {
				validationMessages.push(messages.invalidDate);
			}
		}

		icache.set('validationMessages', validationMessages);
		icache.set('shouldValidate', false);
	}

	return (
		<div classes={classes.root}>
			<Popup key="popup">
				{{
					trigger: (toggleOpen) => {
						return (
							<div classes={classes.input}>
								<TextInput
									key="input"
									trailing={() => (
										<div key="dateIcon" onclick={toggleOpen}>
											<Icon type="dateIcon" />
										</div>
									)}
									type="text"
									value={icache.get('value')}
									onBlur={() => icache.set('shouldValidate', true)}
									onValue={(v) => icache.set('value', v || '')}
									helperText={(icache.get('validationMessages') || []).join('; ')}
								/>
							</div>
						);
					},
					content: (onClose) => {
						return (
							<div classes={classes.popup}>
								<Calendar
									key="calendar"
									maxDate={max}
									minDate={min}
									month={icache.get('month')}
									onDateSelect={(date) => {
										icache.set('value', formatDate(date));
										icache.set('shouldValidate', true);
										onClose();
									}}
									onMonthChange={(month) => icache.set('month', month)}
									onYearChange={(year) => icache.set('year', year)}
									selectedDate={icache.get('date')}
									year={icache.get('year')}
								/>
							</div>
						);
					}
				}}
			</Popup>
		</div>
	);
});
