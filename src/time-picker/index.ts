import { padStart } from '@dojo/framework/shim/string';
import { v, w } from '@dojo/framework/core/vdom';
import { DNode } from '@dojo/framework/core/interfaces';
import ThemedMixin, { theme, ThemedProperties } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import { auto } from '@dojo/framework/core/diff';
import Focus from '@dojo/framework/core/meta/Focus';
import ComboBox from '../combobox/index';
import { formatAriaProperties } from '../common/util';
import { TextInputProperties } from '../text-input/index';
import Label from '../label/index';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/time-picker.m.css';

interface FocusInputEvent extends FocusEvent {
	target: HTMLInputElement;
}

/**
 * @type TimePickerProperties
 *
 * Properties that can be set on a TimePicker component
 *
 * @property autoBlur           Determines whether the input should blur after value selection
 * @property clearable          Determines whether the custom input should be able to be cleared
 * @property CustomOptionItem   Can be used to render a custom option
 * @property CustomOptionMenu   Can be used to render a custom option menu
 * @property end                The maximum time to display in the menu (defaults to '23:59:59')
 * @property getOptionLabel     Can be used to get the text label of an option based on the underlying option object
 * @property inputProperties    TextInput properties to set on the underlying input
 * @property isOptionDisabled   Used to determine if an item should be disabled
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onMenuChange       Called when menu visibility changes
 * @property onRequestOptions   Called when options are shown; should be used to set `options`
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property options            Options for the current input; should be set in response to `onRequestOptions`
 * @property start              The minimum time to display in the menu (defaults to '00:00:00')
 * @property step               The number of seconds between each option in the menu (defaults to 60)
 * @property useNativeElement   Use the native <input type="time"> element if true
 * @property value           The current value
 */
export interface TimePickerProperties extends ThemedProperties, FocusProperties {
	labelAfter?: boolean;
	labelHidden?: boolean;
	label?: string;
	disabled?: boolean;
	widgetId?: string;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
	autoBlur?: boolean;
	clearable?: boolean;
	end?: string;
	getOptionLabel?(option: TimeUnits): string;
	inputProperties?: TextInputProperties;
	isOptionDisabled?(result: any): boolean;
	onBlur?(): void;
	onChange?(value: string): void;
	onFocus?(): void;
	onMenuChange?(open: boolean, key?: string | number): void;
	onRequestOptions?(key?: string | number): void;
	openOnFocus?: boolean;
	options?: TimeUnits[];
	start?: string;
	step?: number;
	useNativeElement?: boolean;
	value?: string;
	valid?: boolean;
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
export function getOptions(
	start: string = '00:00:00',
	end: string = '23:59:59',
	step = 60
): TimeUnits[] {
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
export function parseUnits(value: string | TimeUnits): TimeUnits {
	if (typeof value === 'string') {
		if (!TIME_PATTERN.test(value)) {
			throw new Error('Time strings must be in the format HH:mm or HH:mm:ss');
		}

		const [hour, minute, second = 0] = value.split(':').map((unit) => parseInt(unit, 10));
		return { hour, minute, second } as TimeUnits;
	}

	return value;
}

@theme(css)
export class TimePicker extends ThemedMixin(FocusMixin(WidgetBase))<TimePickerProperties> {
	protected options: TimeUnits[] | null = null;

	private _uuid: string;

	constructor() {
		super();
		this._uuid = uuid();
	}

	private _formatUnits(units: TimeUnits): string {
		const { step = 60 } = this.properties;
		const { hour, minute, second } = units;

		return (step >= 60 ? [hour, minute] : [hour, minute, second])
			.map((unit) => padStart(String(unit), 2, '0'))
			.join(':');
	}

	private _getOptionLabel(value: TimeUnits) {
		const { getOptionLabel } = this.properties;
		const units = parseUnits(value);
		return getOptionLabel ? getOptionLabel(units) : this._formatUnits(units);
	}

	private _onBlur() {
		const { onBlur } = this.properties;
		onBlur && onBlur();
	}

	private _onChange(value: string) {
		const { onChange } = this.properties;
		onChange && onChange(value);
	}

	private _onFocus() {
		const { onFocus } = this.properties;
		onFocus && onFocus();
	}

	private _onMenuChange(open: boolean) {
		const { key, onMenuChange } = this.properties;
		onMenuChange && onMenuChange(open, key);
	}

	private _onNativeBlur() {
		const { onBlur } = this.properties;
		onBlur && onBlur();
	}

	private _onNativeChange(event: FocusInputEvent) {
		const { onChange } = this.properties;
		onChange && onChange(event.target.value);
	}

	private _onNativeFocus() {
		const { onFocus } = this.properties;
		onFocus && onFocus();
	}

	private _onRequestOptions() {
		const { onRequestOptions, key } = this.properties;
		onRequestOptions && onRequestOptions(key);
	}

	protected getRootClasses(): (string | null)[] {
		const { disabled, valid, readOnly, required } = this.properties;
		const focus = this.meta(Focus).get('root');
		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
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

	protected renderCustomInput(): DNode {
		const {
			clearable,
			disabled,
			extraClasses,
			widgetId = this._uuid,
			inputProperties,
			valid,
			isOptionDisabled,
			label,
			labelHidden,
			openOnFocus,
			options = this.getOptions(),
			readOnly,
			required,
			theme,
			classes,
			value
		} = this.properties;

		return w(ComboBox, {
			key: 'combo',
			clearable,
			disabled,
			extraClasses,
			getResultLabel: this._getOptionLabel.bind(this),
			widgetId,
			focus: this.shouldFocus,
			inputProperties,
			valid,
			isResultDisabled: isOptionDisabled,
			label,
			labelHidden,
			onBlur: this._onBlur,
			onChange: this._onChange,
			onFocus: this._onFocus,
			onMenuChange: this._onMenuChange,
			onRequestResults: this._onRequestOptions.bind(this),
			openOnFocus,
			readOnly,
			required,
			results: options,
			theme,
			classes,
			value
		});
	}

	protected renderNativeInput(): DNode {
		const {
			disabled,
			end,
			widgetId = this._uuid,
			inputProperties = {},
			valid,
			name,
			readOnly,
			required,
			start,
			step,
			value,
			label,
			theme,
			classes,
			labelHidden = false,
			labelAfter = false
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		const { aria = {} } = inputProperties;

		const children = [
			label
				? w(
						Label,
						{
							theme,
							classes,
							disabled,
							focused: focus.containsFocus,
							valid,
							readOnly,
							required,
							hidden: labelHidden,
							forId: widgetId
						},
						[label]
				  )
				: null,
			v('input', {
				id: widgetId,
				...formatAriaProperties(aria),
				'aria-invalid': valid === false ? 'true' : null,
				'aria-readonly': readOnly === true ? 'true' : null,
				classes: this.theme(css.input),
				disabled,
				focus: this.shouldFocus,
				valid,
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
			})
		];

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses())
			},
			labelAfter ? children.reverse() : children
		);
	}

	render(): DNode {
		const { useNativeElement } = this.properties;

		return useNativeElement ? this.renderNativeInput() : this.renderCustomInput();
	}
}

export default TimePicker;
