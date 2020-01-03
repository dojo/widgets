import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { parseDate, formatDateISO, formatDate } from './date-utils';
import theme from '../middleware/theme';
import Calendar from '../calendar';
import TextInput from '../text-input';
import Icon from '../icon';
import Popup from '../popup';
import * as css from '../theme/default/date-input.m.css';
import bundle from './nls/DateInput';

export interface DateInputProperties {
	/** The initial value */
	initialValue?: string;
	/** Set the latest date the calendar will display in (it will show the whole month but not allow previous selections) */
	max?: string;
	/** Set the earliest date the calendar will display (it will show the whole month but not allow previous selections) */
	min?: string;
	/** name used on the underlying form input's name attribute */
	name: string;
	/** Callback fired with new value in YYYY-MM-DD format */
	onValue?(date: string): void;
}

interface DateInputICache {
	/** Current user-inputted value */
	inputValue: string;
	/** The last valid Date of value */
	value: Date;
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

export default factory(function({ properties, middleware: { theme, icache, i18n } }) {
	const { name, onValue, initialValue } = properties();
	const { messages } = i18n.localize(bundle);
	const classes = theme.classes(css);
	const max = parseDate(properties().max);
	const min = parseDate(properties().min);

	const inputValue = icache.getOrSet('inputValue', () => {
		const parsed = initialValue && parseDate(initialValue);

		return formatDate(parsed || new Date());
	});
	const shouldValidate = icache.getOrSet('shouldValidate', true);

	if (shouldValidate) {
		let validationMessages: string[] = [];

		if (min && max && min > max) {
			// if min & max create an impossible range, no need to validate anything else
			validationMessages.push(messages.invalidProps);
		} else {
			const newDate = parseDate(inputValue);

			if (newDate !== undefined) {
				if (min && newDate < min) {
					validationMessages.push(messages.tooEarly);
				} else if (max && newDate > max) {
					validationMessages.push(messages.tooLate);
				} else {
					icache.set('value', newDate);
					icache.set('month', newDate.getMonth());
					icache.set('year', newDate.getFullYear());
					icache.set('inputValue', formatDate(newDate));
					if (onValue) {
						onValue(formatDateISO(newDate));
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
			<input type="hidden" name={name} value={formatDateISO(icache.get('value'))} />
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
									value={icache.get('inputValue')}
									onBlur={() => icache.set('shouldValidate', true)}
									onValue={(v) => icache.set('inputValue', v || '')}
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
										icache.set('inputValue', formatDate(date));
										icache.set('shouldValidate', true);
										onClose();
									}}
									onMonthChange={(month) => icache.set('month', month)}
									onYearChange={(year) => icache.set('year', year)}
									selectedDate={icache.get('value')}
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
