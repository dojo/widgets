import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import { padStart } from '@dojo/framework/shim/string';
import { List, ListOption } from '../list';
import focus from '@dojo/framework/core/middleware/focus';
import * as css from '../theme/default/time-picker.m.css';
import * as inputCss from '../theme/default/text-input.m.css';
import TriggerPopup from '../trigger-popup';
import TextInput, { Addon } from '../text-input';
import Icon from '../icon';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { Keys } from '../common/util';
import bundle from './nls/TimePicker';
import i18n from '@dojo/framework/core/middleware/i18n';
import {
	createMemoryResourceTemplate,
	createResourceMiddleware
} from '@dojo/framework/core/middleware/resources';

import { RenderResult } from '@dojo/framework/core/interfaces';

export interface TimePickerProperties {
	/** Set the disabled property of the control */
	disabled?: boolean;

	/** Callback to determine if a particular time entry should be disabled */
	timeDisabled?: (time: Date) => boolean;

	/** The name of the field */
	name?: string;

	/** The initial selected value */
	initialValue?: string;

	/** Controlled value property */
	value?: string;

	/** Called when the value changes */
	onValue?(value: string): void;

	/** Indicates the input is required to complete the form */
	required?: boolean;

	/** Callabck when valid state has changed */
	onValidate?(valid: boolean, message: string): void;

	/** The maximum time to display in the menu (defaults to '23:59:59') */
	max?: string;

	/** The minimum time to display in the menu (defaults to '00:00:00') */
	min?: string;

	/** The number of seconds between each option in the menu (defaults to 1800) */
	step?: number;

	/** How the time is formatted. 24 hour, 12 hour */
	format?: '24' | '12';
}

export interface TimePickerChildren {
	/** The label to be displayed above the input */
	label?: RenderResult;
}

export interface TimePickerICache {
	value?: string;
	lastValue: string;
	nextValue: string;
	inputValue: string;
	shouldValidate: boolean;
	validationMessage: string | undefined;
	focusNode: 'input' | 'menu';
	inputValid?: boolean;
	inputValidMessage?: string;
	isValid?: boolean;
	initialValue?: string;
}

const resource = createResourceMiddleware();

const factory = create({
	resource,
	theme,
	i18n,
	focus,
	icache: createICacheMiddleware<TimePickerICache>()
})
	.properties<TimePickerProperties>()
	.children<TimePickerChildren | RenderResult | undefined>();

export interface TimeParser {
	regex: RegExp;
	positions: {
		hour?: number;
		minute?: number;
		second?: number;
		amPm?: number;
	};
}

const formats: Record<string, TimeParser> = {
	hh: {
		regex: /^(\d{1,2})$/i,
		positions: {
			hour: 1
		}
	},

	hhmm: {
		regex: /^(\d{1,2}):(\d{1,2})$/,
		positions: {
			hour: 1,
			minute: 2
		}
	},
	hhmmss: {
		regex: /^(\d{1,2}):(\d{1,2}):(\d{1,2})$/,
		positions: {
			hour: 1,
			minute: 2,
			second: 3
		}
	},
	hham: {
		regex: /^(\d{1,2})\s*([ap]\.?m\.?)$/i,
		positions: {
			hour: 1,
			amPm: 2
		}
	},

	hhmmam: {
		regex: /^(\d{1,2}):(\d{1,2})\s*([ap]\.?m\.?)$/i,
		positions: {
			hour: 1,
			minute: 2,
			amPm: 3
		}
	},
	hhmmssam: {
		regex: /^(\d{1,2}):(\d{1,2}):(\d{1,2})\s*([ap]\.?m\.?)$/i,
		positions: {
			hour: 1,
			minute: 2,
			second: 3,
			amPm: 4
		}
	}
};

const formats24 = ['hh', 'hhmm', 'hhmmss'];

const formats12 = ['hh', 'hhmm', 'hhmmss', 'hham', 'hhmmam', 'hhmmssam'];

const template = createMemoryResourceTemplate<ListOption>();

export function parseTime(time: string | undefined, hour12: boolean) {
	if (!time) {
		return undefined;
	}

	const timeFormats = hour12 ? formats12 : formats24;

	for (const key of timeFormats) {
		const format = formats[key] as TimeParser;

		const match = format.regex.exec(time);
		if (match) {
			let hours = format.positions.hour ? parseInt(match[format.positions.hour], 0) : 0;
			const minutes = format.positions.minute
				? parseInt(match[format.positions.minute], 0)
				: 0;
			const seconds = format.positions.second
				? parseInt(match[format.positions.second], 0)
				: 0;

			if (
				hour12 &&
				format.positions.amPm &&
				match[format.positions.amPm].toLocaleLowerCase()[0] === 'p' &&
				hours !== 12
			) {
				// special case for "12pm", which is just 12
				hours += 12;
			} else if (
				hour12 &&
				format.positions.amPm &&
				match[format.positions.amPm].toLocaleLowerCase()[0] === 'a' &&
				hours === 12
			) {
				// special case of "12am", which we want to be hour 0
				hours = 0;
			}

			if (hours === undefined || isNaN(hours) || isNaN(minutes) || isNaN(seconds)) {
				return undefined;
			}

			return new Date(1970, 0, 1, hours, minutes, seconds, 0);
		}
	}

	return undefined;
}

export function format24HourTime(dt: Date) {
	return `${padStart(String(dt.getHours()), 2, '0')}:${padStart(
		String(dt.getMinutes()),
		2,
		'0'
	)}:${padStart(String(dt.getSeconds()), 2, '0')}`;
}

function isTimePickerChildren(children: any): children is TimePickerChildren {
	// In order to not make this a breaking change, check for an edge case where an object
	// with a label property that would have been used as a label might instead be treated as a render result
	return children && children.hasOwnProperty && children.hasOwnProperty('label');
}

export const TimePicker = factory(function TimePicker({
	id,
	middleware: { theme, icache, focus, i18n, resource },
	properties,
	children
}) {
	const themedCss = theme.classes(css);
	const { messages } = i18n.localize(bundle);

	const formatTime = (time: Date) => {
		const { format = '24', step = 1800 } = properties();

		const hideSeconds = step >= 60 && time.getSeconds() === 0;

		if (format === '24') {
			return time
				.toLocaleTimeString(undefined, {
					hour12: false,
					hour: 'numeric',
					minute: 'numeric',
					second: hideSeconds ? undefined : 'numeric'
				})
				.replace(/[^a-zA-Z\d\s:.]/g, '');
		} else {
			return time
				.toLocaleTimeString(undefined, {
					hour12: true,
					hour: 'numeric',
					minute: 'numeric',
					second: hideSeconds ? undefined : 'numeric'
				})
				.replace(/[^a-zA-Z\d\s:.]/g, '');
		}
	};

	const { initialValue, format = '24', value: controlledValue } = properties();
	if (
		initialValue !== undefined &&
		controlledValue === undefined &&
		icache.get('initialValue') !== initialValue
	) {
		const parsed = initialValue && parseTime(initialValue, format === '12');
		icache.set('inputValue', parsed ? formatTime(parsed) : '');
		icache.set('initialValue', initialValue);
		icache.set('shouldValidate', true);
	}

	if (controlledValue !== undefined && icache.get('lastValue') !== controlledValue) {
		const parsed = controlledValue && parseTime(controlledValue, format === '12');
		icache.set('inputValue', parsed ? formatTime(parsed) : '');
		icache.set('value', parsed ? format24HourTime(parsed) : '');
		icache.set('lastValue', controlledValue);
	}

	const inputValue = icache.getOrSet('inputValue', () => {
		const { initialValue, format } = properties();
		const parsed = initialValue && parseTime(initialValue, format === '12');

		return parsed ? formatTime(parsed) : '';
	});

	const shouldValidate = icache.getOrSet('shouldValidate', true);
	const shouldFocus = focus.shouldFocus();
	const focusNode = icache.getOrSet('focusNode', 'input');

	if (shouldValidate) {
		const testValue = icache.get('nextValue') || inputValue;
		const { onValidate, onValue, format } = properties();
		const max = parseTime(properties().max, format === '12');
		const min = parseTime(properties().min, format === '12');

		let isValid = icache.get('inputValid');
		let validationMessages: string[] = [];

		if (icache.get('inputValidMessage')) {
			validationMessages.push(icache.get('inputValidMessage') || '');
		}

		if (min && max && min > max) {
			validationMessages.push(messages.invalidProps);
			isValid = false;
		} else {
			const newTime = parseTime(testValue, format === '12');

			if (newTime !== undefined) {
				if (min && newTime < min) {
					validationMessages.push(messages.tooEarly);
				} else if (max && newTime > max) {
					validationMessages.push(messages.tooLate);
				} else {
					const twentyFourHourTime = format24HourTime(newTime);
					if (controlledValue === undefined) {
						icache.set('value', twentyFourHourTime);
						icache.set('inputValue', formatTime(newTime));
					}
					if (onValue) {
						onValue(twentyFourHourTime);
					}
				}
			} else {
				if (inputValue) {
					validationMessages.push(messages.invalidTime);
				}
			}

			isValid = validationMessages.length === 0;
			icache.set('isValid', isValid);
		}

		const validationMessage = validationMessages.join('; ');
		onValidate && onValidate(isValid, validationMessage);

		icache.set('validationMessage', validationMessage);
		icache.set('shouldValidate', false);
	}

	const generateOptions = () => {
		const { min = '00:00:00', max = '23:59:59', step = 1800, timeDisabled } = properties();

		const options: ListOption[] = [];

		const dt = parseTime(min, false) || new Date(1970, 0, 1, 0, 0, 0, 0);
		const end = parseTime(max, false) || new Date(1970, 0, 1, 23, 59, 59, 99);

		while (dt.getDate() === 1 && dt <= end) {
			const value = formatTime(dt);

			options.push({
				label: value,
				value: value,
				disabled: timeDisabled ? timeDisabled(dt) : false
			});

			dt.setSeconds(dt.getSeconds() + step);
		}

		return options;
	};

	const { name, theme: themeProp, classes, variant } = properties();
	const [labelChild] = children();
	const label = isTimePickerChildren(labelChild) ? labelChild.label : labelChild;
	const options = generateOptions();

	return (
		<div classes={[theme.variant(), themedCss.root]}>
			<input
				type="hidden"
				name={name}
				value={icache.getOrSet('value', '')}
				aria-hidden="true"
			/>
			<TriggerPopup key="popup" theme={themeProp} classes={classes} variant={variant}>
				{{
					trigger: (toggleOpen) => {
						function openMenu() {
							icache.set('focusNode', 'menu');
							focus.focus();
							toggleOpen();
						}

						const { disabled, required } = properties();

						return (
							<div classes={themedCss.input}>
								<TextInput
									key="input"
									disabled={disabled}
									required={required}
									focus={() => shouldFocus && focusNode === 'input'}
									theme={theme.compose(
										inputCss,
										css,
										'input'
									)}
									classes={classes}
									variant={variant}
									initialValue={icache.get('inputValue')}
									onBlur={() => icache.set('shouldValidate', true)}
									onValue={(v) =>
										controlledValue === undefined
											? icache.set('inputValue', v || '')
											: icache.set('nextValue', v || '')
									}
									helperText={icache.get('validationMessage')}
									valid={icache.get('isValid') && icache.get('inputValid')}
									onValidate={(valid, message) => {
										if (valid !== icache.get('inputValid')) {
											icache.set('inputValid', valid);
											icache.set('inputValidMessage', message);
										}
									}}
									onKeyDown={(key) => {
										if (key === Keys.Down || key === Keys.Enter) {
											openMenu();
										}
									}}
									type="text"
								>
									{{
										label,
										trailing: (
											<Addon
												theme={themeProp}
												classes={classes}
												variant={variant}
											>
												<button
													disabled={disabled}
													key="clockIcon"
													onclick={(e) => {
														e.stopPropagation();
														openMenu();
													}}
													classes={themedCss.toggleMenuButton}
													type="button"
												>
													<Icon type="clockIcon" />
												</button>
											</Addon>
										)
									}}
								</TextInput>
							</div>
						);
					},
					content: (onClose) => {
						function closeMenu() {
							icache.set('focusNode', 'input');
							focus.focus();
							onClose();
						}

						return (
							<div key="menu-wrapper" classes={themedCss.menuWrapper}>
								<List
									height="auto"
									theme={themeProp}
									classes={classes}
									variant={variant}
									key="menu"
									focus={() => shouldFocus && focusNode === 'menu'}
									resource={resource({
										template,
										initOptions: { id, data: options }
									})}
									onValue={(value) => {
										if (controlledValue === undefined) {
											icache.set('inputValue', value.value);
										} else {
											icache.set('nextValue', value.value);
										}
										icache.set('shouldValidate', true);
										closeMenu();
									}}
									onRequestClose={closeMenu}
									onBlur={closeMenu}
									initialValue={''}
									menu
								/>
							</div>
						);
					}
				}}
			</TriggerPopup>
		</div>
	);
});

export default TimePicker;
