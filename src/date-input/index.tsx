import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { i18n } from '@dojo/framework/core/middleware/i18n';
import { focus } from '@dojo/framework/core/middleware/focus';
import { FocusProperties } from '@dojo/framework/core/mixins/Focus';

import { parseDate, formatDateISO, formatDate } from './date-utils';
import { isRenderResult, Keys } from '../common/util';
import theme, { ThemeProperties } from '../middleware/theme';
import Calendar from '../calendar';
import TextInput from '../text-input';
import Icon from '../icon';
import TriggerPopup from '../trigger-popup';
import * as textInputCss from '../theme/default/text-input.m.css';
import * as css from '../theme/default/date-input.m.css';

import bundle from './nls/DateInput';
import { RenderResult } from '@dojo/framework/core/interfaces';

export interface DateInputProperties extends ThemeProperties, FocusProperties {
	/** The initial value */
	initialValue?: string;
	/** Controlled value property */
	value?: string;
	/** Set the latest date the calendar will display in (it will show the whole month but not allow previous selections) */
	max?: string;
	/** Set the earliest date the calendar will display (it will show the whole month but not allow previous selections) */
	min?: string;
	/** name used on the underlying form input's name attribute */
	name?: string;
	/** Callback fired with new value in YYYY-MM-DD format */
	onValue?(date: string): void;
	/** Callback fired when input validation changes */
	onValidate?: (valid: boolean | undefined, message: string) => void;
	/** Custom date string parser function to allow custom date formats. Must work with dateFormatter */
	dateParser?(date?: string): Date | undefined;
	/** Custom date formatter function to convert Dates to strings. Must work with dateParser */
	dateFormatter?(date?: Date): string | undefined;
	/** The disabled property of the input */
	disabled?: boolean;
	/** The readonly attribute of the input */
	readOnly?: boolean;
	/** Determines if this input is required, styles accordingly */
	required?: boolean;
}

export interface DateInputChildren {
	/** The label for the wrapped text input */
	label?: RenderResult;
}

interface DateInputICache {
	/** The most recent "initialValue" property passed */
	initialValue: string;
	/** Current user-inputted value */
	inputValue?: string;
	/** The last valid Date of value */
	value: Date;
	/** The last "value" property passed */
	lastValue: string;
	/** A possible new value that should not be saved until we call a callback */
	nextValue: string;
	/** Message for current validation state */
	validationMessage: string | undefined;
	/** Indicates which node will be focused */
	focusNode: 'input' | 'calendar';
	/** Indicates if user has interacted with input */
	dirty: boolean;
	/** Calls when user inputs value */
	callOnValue: void;
}

const icache = createICacheMiddleware<DateInputICache>();
const factory = create({ theme, icache, i18n, focus })
	.properties<DateInputProperties>()
	.children<DateInputChildren | RenderResult | undefined>();

export default factory(function({
	properties,
	children,
	middleware: { theme, icache, i18n, focus }
}) {
	const {
		initialValue,
		name,
		onValue,
		onValidate,
		dateParser = parseDate,
		dateFormatter = formatDate,
		value: controlledValue,
		disabled = false,
		readOnly = false,
		min: minInput,
		max: maxInput,
		theme: themeProp,
		variant,
		classes,
		required
	} = properties();
	const { messages } = i18n.localize(bundle);
	const themedCss = theme.classes(css);
	const max = (Boolean(maxInput) && dateParser(maxInput)) || undefined;
	const min = (Boolean(minInput) && dateParser(minInput)) || undefined;

	if (
		initialValue !== undefined &&
		controlledValue === undefined &&
		icache.get('initialValue') !== initialValue
	) {
		const parsed = initialValue && dateParser(initialValue);

		if (parsed) {
			icache.set('inputValue', dateFormatter(parsed));
		}
		icache.set('initialValue', initialValue);
		icache.delete('callOnValue');
	}

	if (controlledValue !== undefined && icache.get('lastValue') !== controlledValue) {
		const parsed = controlledValue && dateParser(controlledValue);
		if (parsed) {
			icache.set('inputValue', dateFormatter(parsed));
			icache.set('value', parsed);
		}
		icache.set('lastValue', controlledValue);
	}

	const shouldFocus = focus.shouldFocus();
	const focusNode = icache.getOrSet('focusNode', 'input');
	const [labelChild] = children();
	const label = isRenderResult(labelChild) ? labelChild : labelChild.label;

	function callOnValue() {
		const testValue =
			controlledValue === undefined ? icache.get('inputValue') : icache.get('nextValue');
		let isValid: boolean | undefined;
		let validationMessages: string[] = [];

		// if min & max create an impossible range, no need to validate anything else
		if (min && max && min > max) {
			validationMessages.push(messages.invalidProps);
			isValid = false;
		} else {
			const newDate = dateParser(testValue);

			if (newDate !== undefined) {
				if (min && newDate < min) {
					validationMessages.push(messages.tooEarly);
				} else if (max && newDate > max) {
					validationMessages.push(messages.tooLate);
				} else {
					if (controlledValue === undefined) {
						icache.set('value', newDate);
						icache.set('inputValue', dateFormatter(newDate));
					}
					if (onValue) {
						onValue(formatDateISO(newDate));
					}
				}
			} else if (testValue) {
				validationMessages.push(messages.invalidDate);
			} else {
				onValue && onValue('');
			}

			isValid = validationMessages.length === 0;
		}

		if (testValue === '' && icache.get('dirty') && required) {
			validationMessages = [messages.requiredDate];
			isValid = false;
		}

		const validationMessage = validationMessages.join('; ');
		onValidate && onValidate(isValid, validationMessage);
		icache.set('validationMessage', validationMessage);
	}
	icache.getOrSet('callOnValue', () => callOnValue());

	return (
		<div classes={[theme.variant(), themedCss.root]}>
			<input
				type="hidden"
				name={name}
				value={formatDateISO(icache.get('value'))}
				aria-hidden="true"
				required={required}
			/>
			<TriggerPopup key="popup" theme={themeProp} classes={classes} variant={variant}>
				{{
					trigger: (toggleOpen) => {
						function openCalendar() {
							if (!disabled && !readOnly) {
								icache.set('focusNode', 'calendar');
								focus.focus();
								toggleOpen();
							}
						}

						return (
							<div classes={themedCss.input}>
								<TextInput
									key="input"
									disabled={disabled}
									readOnly={readOnly}
									focus={() => shouldFocus && focusNode === 'input'}
									theme={theme.compose(
										textInputCss,
										css,
										'input'
									)}
									type="text"
									initialValue={icache.get('inputValue')}
									onBlur={() => {
										if (icache.get('dirty')) {
											callOnValue();
										}
									}}
									onValue={(v = '') => {
										icache.set('dirty', true);
										icache.set(
											controlledValue === undefined
												? 'inputValue'
												: 'nextValue',
											v
										);
									}}
									valid={
										icache.get('validationMessage')
											? {
													valid: false,
													message: icache.get('validationMessage')
											  }
											: undefined
									}
									onFocus={() => {
										icache.set('dirty', true);
									}}
									onKeyDown={(key) => {
										if (
											key === Keys.Down ||
											key === Keys.Space ||
											key === Keys.Enter
										) {
											if (key === Keys.Enter && icache.get('dirty')) {
												callOnValue();
											}
											openCalendar();
										}
									}}
									classes={classes}
									variant={variant}
								>
									{{
										label,
										trailing: (
											<button
												key="dateIcon"
												disabled={disabled}
												onclick={(e) => {
													e.stopPropagation();
													openCalendar();
												}}
												classes={themedCss.toggleCalendarButton}
												type="button"
											>
												<Icon type="dateIcon" />
											</button>
										)
									}}
								</TextInput>
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
							<div classes={themedCss.popup}>
								<Calendar
									key="calendar"
									focus={() => shouldFocus && focusNode === 'calendar'}
									maxDate={max}
									minDate={min}
									initialValue={
										icache.get('value') || parseDate(formatDateISO(new Date()))
									}
									onValue={(date) => {
										icache.set(
											controlledValue === undefined
												? 'inputValue'
												: 'nextValue',
											dateFormatter(date)
										);
										callOnValue();
										closeCalendar();
									}}
									theme={themeProp}
									classes={classes}
									variant={variant}
								/>
							</div>
						);
					}
				}}
			</TriggerPopup>
		</div>
	);
});
