import { padStart } from '@dojo/shim/string';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import { diffProperty, WidgetBase } from '@dojo/widget-core/WidgetBase';
import { auto } from '@dojo/widget-core/diff';
import * as css from './styles/timePicker.m.css';
import ComboBox from '../combobox/ComboBox';
import Label, { LabelOptions, parseLabelClasses } from '../label/Label';
import { TextInputProperties } from '../textinput/TextInput';

/**
 * @type TimePickerProperties
 *
 * Properties that can be set on a TimePicker component
 *
 * @property autoBlur           Determines whether the input should blur after value selection
 * @property clearable          Determines whether the custom input should be able to be cleared
 * @property customOptionItem   Can be used to render a custom option
 * @property customOptionMenu   Can be used to render a custom option menu
 * @property disabled           Prevents user interaction and styles content accordingly
 * @property end                The maximum time to display in the menu (defaults to '23:59:59')
 * @property formId             ID of a form element associated with the form field
 * @property getOptionLabel     Can be used to get the text label of an option based on the underlying option object
 * @property inputProperties    TextInput properties to set on the underlying input
 * @property invalid            Determines if this input is valid
 * @property isOptionDisabled   Used to determine if an item should be disabled
 * @property label              Label settings for form label text, position, and visibility
 * @property name               The native input's name.
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onMenuChange       Called when menu visibility changes
 * @property onRequestOptions   Called when options are shown; should be used to set `options`
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property options            Options for the current input; should be set in response to `onRequestOptions`
 * @property readOnly           Prevents user interaction
 * @property required           Determines if this input is required, styles accordingly
 * @property start              The minimum time to display in the menu (defaults to '00:00:00')
 * @property step               The number of seconds between each option in the menu (defaults to 60)
 * @property useNativeElement   Use the native <input type="time"> element if true
 * @property value              Value to set on the input
 */
export interface TimePickerProperties extends ThemeableProperties {
	autoBlur?: boolean;
	clearable?: boolean;
	customOptionItem?: any;
	customOptionMenu?: any;
	disabled?: boolean;
	end?: string;
	formId?: string;
	getOptionLabel?(option: TimeUnits): string;
	inputProperties?: TextInputProperties;
	invalid?: boolean;
	isOptionDisabled?(result: any): boolean;
	label?: string | LabelOptions;
	name?: string;
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onMenuChange?(open: boolean): void;
	onRequestOptions?(value: string, options: TimeUnits[]): void;
	openOnFocus?: boolean;
	options?: TimeUnits[];
	readOnly?: boolean;
	required?: boolean;
	start?: string;
	step?: number;
	useNativeElement?: boolean;
	value?: string;
}

/**
 * An object representing a dateless time (without milliseconds).
 *
 * @property hour    The number of hours.
 * @property minute  An optional number of minutes.
 * @property second  An optional number of seconds.
 */
export interface TimeUnits {
	hour: number;
	minute?: number;
	second?: number;
}

/**
 * @private
 * Regular epression that matches a standard time string ('HH:mm:ss').
 */
const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;

/**
 * Generate an array of time unit objects from the specified start date to the specified end date.
 *
 * @param start    The start time. Defaults to midnight.
 * @param end      The end time. Defaults to 23:59:59.
 * @param step     The amount of time in seconds between each step. Defaults to 60.
 * @return         An array of time unit objects.
 */
export function getOptions(start: string = '00:00:00', end: string = '23:59:59', step = 60): TimeUnits[] {
	const endUnits = parseUnits(end);
	const startUnits = parseUnits(start);
	const endTime = getTime(endUnits);
	const date = new Date();
	let time = getTime(startUnits, date);

	const i = step * 1000;
	const options: number[] = [];

	while (time <= endTime) {
		options.push(time);
		time += i;
	}

	return options.map((time: number) => {
		date.setTime(time);
		return {
			hour: date.getHours(),
			minute: date.getMinutes(),
			second: date.getSeconds()
		};
	});
}

/**
 * @private
 * Create a numeric timestamp for the specified hour, minute, and second units.
 *
 * @param units   An object containing the hours, minutes, and seconds for the time.
 * @param date    An optional date object.
 * @return        The timestamp, in milliseconds, according to universal time.
 */
function getTime(units: TimeUnits, date = new Date()) {
	const { hour, minute, second } = units;
	date.setHours(hour);
	date.setMinutes(minute as number);
	date.setSeconds(second as number);
	date.setMilliseconds(0);
	return date.getTime();
}

/**
 * Convert a standard time string into an object with `hour`, `minute`, and `second` number properties.
 *
 * For example, '12:30' is converted to `{ hour: 12, minute: 30, second: 0 }`, and '19:03:27' is converted
 * to `{ hour: 19, minute: 3, second: 27 }`.
 *
 * @param value   A standard time string or an object with `hour`, `minute`, and `second` properties.
 * @return        An object containing `hour`, `second`, and `number` properties.
 */
export function parseUnits (value: string | TimeUnits): TimeUnits {
	if (typeof value === 'string') {
		if (!TIME_PATTERN.test(value)) {
			throw new Error('Time strings must be in the format HH:mm or HH:mm:ss');
		}

		const [ hour, minute, second = 0 ] = value.split(':').map(unit => parseInt(unit, 10));
		return { hour, minute, second } as TimeUnits;
	}

	return value;
}

export const TimePickerBase = ThemeableMixin(WidgetBase);

@theme(css)
export class TimePicker extends TimePickerBase<TimePickerProperties> {
	protected options: TimeUnits[] | null;

	render(): DNode {
		const {
			disabled,
			formId,
			invalid,
			label,
			readOnly,
			required,
			useNativeElement
		} = this.properties;

		if (useNativeElement) {
			const input = this.renderNativeInput();
			let children: DNode[] = [ input ];

			if (label) {
				children = [ w(Label, {
					extraClasses: { root: parseLabelClasses(this.classes(
						css.input,
						disabled ? css.disabled : null,
						invalid ? css.invalid : null,
						readOnly ? css.readonly : null,
						required ? css.required : null).get())
					},
					formId,
					label,
					theme: this.properties.theme
				}, [ input ]) ];
			}

			return v('span', {
				classes: this.classes(css.root),
				key: 'root'
			}, children);
		}

		return this.renderCustomInput();
	}

	protected getOptions() {
		if (this.options) {
			return this.options;
		}

		const { end, start, step } = this.properties;
		this.options = getOptions(start, end, step);
		return this.options;
	}

	@diffProperty('start', auto)
	@diffProperty('end', auto)
	@diffProperty('step', auto)
	protected onPropertiesChanged() {
		this.options = null;
	}

	protected renderNativeInput(): DNode {
		const {
			disabled,
			end,
			inputProperties,
			invalid,
			name,
			readOnly,
			required,
			start,
			step,
			value
		} = this.properties;

		const classes = [
			css.input,
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		return v('input', {
			'aria-describedby': inputProperties && inputProperties.describedBy,
			'aria-invalid': invalid ? 'true' : null,
			'aria-readonly': readOnly ? 'true' : null,
			classes: this.classes(...classes),
			disabled,
			invalid,
			key: 'native-input',
			max: end,
			min: start,
			name,
			onblur: this._onNativeBlur,
			onchange: this._onNativeChange,
			onfocus: this._onNativeFocus,
			readOnly,
			required,
			step,
			type: 'time',
			value
		});
	}

	protected renderCustomInput(): DNode {
		const {
			autoBlur,
			clearable,
			customOptionItem,
			customOptionMenu,
			disabled,
			extraClasses,
			formId,
			inputProperties,
			invalid,
			isOptionDisabled,
			label,
			onBlur,
			onChange,
			onFocus,
			onMenuChange,
			openOnFocus,
			options,
			readOnly,
			required,
			theme,
			value
		} = this.properties;

		return w(ComboBox, {
			autoBlur,
			clearable,
			customResultItem: customOptionItem,
			customResultMenu: customOptionMenu,
			disabled,
			extraClasses,
			formId,
			getResultLabel: this._getOptionLabel.bind(this),
			inputProperties,
			invalid,
			isResultDisabled: isOptionDisabled,
			label,
			onBlur,
			onChange,
			onFocus,
			onMenuChange,
			onRequestResults: this._onRequestOptions.bind(this),
			openOnFocus,
			readOnly,
			required,
			results: options,
			theme,
			value
		});
	}

	private _formatUnits(units: TimeUnits): string {
		const { step = 60 } = this.properties;
		const { hour, minute, second } = units;

		return (step >= 60 ? [ hour, minute ] : [ hour, minute, second ])
			.map(unit => padStart(String(unit), 2, '0'))
			.join(':');
	}

	private _getOptionLabel(value: TimeUnits) {
		const { getOptionLabel } = this.properties;
		const units = parseUnits(value);
		return getOptionLabel ? getOptionLabel(units) : this._formatUnits(units);
	}

	private _onNativeBlur(event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur((<HTMLInputElement> event.target).value);
	}

	private _onNativeChange(event: FocusEvent) {
		this.properties.onChange && this.properties.onChange((<HTMLInputElement> event.target).value);
	}

	private _onNativeFocus(event: FocusEvent) {
		this.properties.onFocus && this.properties.onFocus((<HTMLInputElement> event.target).value);
	}

	private _onRequestOptions(value: string) {
		this.properties.onRequestOptions && this.properties.onRequestOptions(value, this.getOptions());
	}
}

export default TimePicker;
