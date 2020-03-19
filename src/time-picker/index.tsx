import { create, tsx } from '@dojo/framework/core/vdom';
import theme from '../middleware/theme';
import Select from '../select';
import { padStart } from '@dojo/framework/shim/string';
import { MenuOption } from '../menu';
import focus from '@dojo/framework/core/middleware/focus';
import * as selectCss from '../theme/default/select.m.css';
import * as timePickerCss from '../theme/default/time-picker.m.css';

export interface TimePickerProperties {
	/** Set the disabled property of the control */
	disabled?: boolean;

	/** Callback to determine if a particular time entry should be disabled */
	timeDisabled?: (time: Date) => boolean;

	/** Adds a <label> element with the supplied text */
	label?: string;

	/** The name of the field */
	name?: string;

	/** The initial selected value */
	initialValue?: string;

	/** Called when the value changes */
	onValue?(value: string): void;

	/** Indicates the input is required to complete the form */
	required?: boolean;

	/** Callabck when valid state has changed */
	onValidate?(valid: boolean): void;

	/** The maximum time to display in the menu (defaults to '23:59:59') */
	max?: string;

	/** The minimum time to display in the menu (defaults to '00:00:00') */
	min?: string;

	/** The number of seconds between each option in the menu (defaults to 1800) */
	step?: number;

	/** How the time is formatted. 24 hour, 12 hour, or locale-specific format (defaults to 24) */
	format?: '24' | '12' | 'locale';
}

const factory = create({
	theme,
	focus
}).properties<TimePickerProperties>();

export const TimePicker = factory(function TimePicker({ middleware: { theme }, properties }) {
	function parseDate(time: string): [number, number, number] {
		const [hours, minutes, seconds] = time.split(':');

		return [
			parseInt(hours || '0', 10),
			parseInt(minutes || '0', 10),
			parseInt(seconds || '0', 10)
		];
	}

	const formatTime = (hideSeconds: boolean, time: Date) => {
		const { format = '24' } = properties();

		if (format === '24') {
			return time.toLocaleTimeString(undefined, {
				hour12: false,
				hour: 'numeric',
				minute: 'numeric',
				second: hideSeconds ? undefined : 'numeric'
			});
		} else if (format === '12') {
			return time.toLocaleTimeString(undefined, {
				hour12: true,
				hour: 'numeric',
				minute: 'numeric',
				second: hideSeconds ? undefined : 'numeric'
			});
		} else {
			return time.toLocaleTimeString(undefined, {
				hour: 'numeric',
				minute: 'numeric',
				second: hideSeconds ? undefined : 'numeric'
			});
		}
	};

	const generateOptions = () => {
		const { min = '00:00:00', max = '23:59:59', step = 1800, timeDisabled } = properties();

		const options: MenuOption[] = [];

		const [startHours, startMinutes, startSeconds] = parseDate(min);
		const [endHours, endMinutes, endSeconds] = parseDate(max);

		const dt = new Date(1970, 0, 1, startHours, startMinutes, startSeconds, 0);
		const endDate = new Date(1970, 0, 1, endHours, endMinutes, endSeconds, 0);

		while (dt.getDate() === 1 && dt.valueOf() <= endDate.valueOf()) {
			const value = `${padStart(String(dt.getHours()), 2, '0')}:${padStart(
				String(dt.getMinutes()),
				2,
				'0'
			)}:${padStart(String(dt.getSeconds()), 2, '0')}`;

			options.push({
				label: formatTime(step >= 60, dt),
				value,
				disabled: timeDisabled ? timeDisabled(dt) : false
			});

			dt.setSeconds(dt.getSeconds() + step);
		}

		return options;
	};

	const {
		onValue,
		initialValue,
		required,
		disabled,
		label,
		name,
		focus,
		onValidate
	} = properties();

	return (
		<Select
			key="root"
			initialValue={initialValue}
			options={generateOptions()}
			onValue={onValue || (() => undefined)}
			required={required}
			disabled={disabled}
			label={label}
			name={name}
			focus={focus}
			onValidate={onValidate}
			theme={theme.compose(
				selectCss,
				timePickerCss
			)}
		/>
	);
});

export default TimePicker;
