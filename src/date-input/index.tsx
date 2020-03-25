import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { focus } from '@dojo/framework/core/middleware/focus';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';

import { parseDate, formatDateISO, formatDate } from './date-utils';
import { Keys } from '../common/util';
import theme, { ThemeProperties } from '../middleware/theme';
import Calendar from '../calendar';
import TextInput from '../text-input';
import Icon from '../icon';
import TriggerPopup from '../trigger-popup';
import * as textInputCss from '../theme/default/text-input.m.css';
import * as css from '../theme/default/date-input.m.css';

import bundle from './nls/DateInput';

export interface DateInputProperties extends ThemeProperties, FocusProperties {
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
	/** Callback fired when input validation changes */
	onValidate?: (valid: boolean | undefined, message: string) => void;
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
	validationMessage: string | undefined;
	/** Indicates which node will be focused */
	focusNode: 'input' | 'calendar';
}

const icache = createICacheMiddleware<DateInputICache>();
const factory = create({ theme, icache, i18n, focus }).properties<DateInputProperties>();

export default factory(function({ properties, middleware: { theme, icache, i18n, focus } }) {
	const { initialValue, name, onValue, onValidate } = properties();
	const { messages } = i18n.localize(bundle);
	const classes = theme.classes(css);
	const max = parseDate(properties().max);
	const min = parseDate(properties().min);

	const inputValue = icache.getOrSet('inputValue', () => {
		const parsed = initialValue && parseDate(initialValue);

		return formatDate(parsed || new Date());
	});
	const shouldValidate = icache.getOrSet('shouldValidate', true);
	const shouldFocus = focus.shouldFocus();
	const focusNode = icache.getOrSet('focusNode', 'input');

	if (shouldValidate) {
		let isValid: boolean | undefined;
		let validationMessages: string[] = [];

		// if min & max create an impossible range, no need to validate anything else
		if (min && max && min > max) {
			validationMessages.push(messages.invalidProps);
			isValid = false;
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

			isValid = validationMessages.length === 0;
		}

		const validationMessage = validationMessages.join('; ');
		onValidate && onValidate(isValid, validationMessage);
		icache.set('validationMessage', validationMessage);
		icache.set('shouldValidate', false);
	}

	return (
		<div classes={classes.root}>
			<input
				type="hidden"
				name={name}
				value={formatDateISO(icache.get('value'))}
				aria-hidden="true"
			/>
			<TriggerPopup key="popup">
				{{
					trigger: (toggleOpen) => {
						function openCalendar() {
							icache.set('focusNode', 'calendar');
							focus.focus();
							toggleOpen();
						}

						return (
							<div classes={classes.input}>
								<TextInput
									key="input"
									focus={() => shouldFocus && focusNode === 'input'}
									theme={theme.compose(
										textInputCss,
										css,
										'input'
									)}
									trailing={() => (
										<button
											key="dateIcon"
											onclick={(e) => {
												e.stopPropagation();
												openCalendar();
											}}
											classes={classes.toggleCalendarButton}
											type="button"
										>
											<Icon type="dateIcon" />
										</button>
									)}
									type="text"
									initialValue={icache.get('inputValue')}
									onBlur={() => icache.set('shouldValidate', true)}
									onValue={(v) => icache.set('inputValue', v || '')}
									helperText={icache.get('validationMessage')}
									onKeyDown={(key) => {
										if (
											key === Keys.Down ||
											key === Keys.Space ||
											key === Keys.Enter
										) {
											openCalendar();
										}
									}}
								/>
							</div>
						);
					},
					content: (onClose) => {
						function closeCalendar() {
							icache.set('focusNode', 'input');
							focus.focus();
							onClose();
						}

						return (
							<div classes={classes.popup}>
								<Calendar
									key="calendar"
									focus={() => shouldFocus && focusNode === 'calendar'}
									maxDate={max}
									minDate={min}
									month={icache.get('month')}
									onDateSelect={(date) => {
										icache.set('inputValue', formatDate(date));
										icache.set('shouldValidate', true);
										closeCalendar();
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
			</TriggerPopup>
		</div>
	);
});
