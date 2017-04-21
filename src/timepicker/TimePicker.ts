import { padStart } from '@dojo/shim/string';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/timePicker.m.css';
import ComboBox from '../combobox/ComboBox';
import Label, { LabelOptions } from '../label/Label';
import { TextInputProperties } from '../textinput/TextInput';

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
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onMenuChange?(open: boolean): void;
	onRequestOptions?(value: string, getOptions: () => TimeUnits[]): void;
	openOnFocus?: boolean;
	options?: TimeUnits[];
	readOnly?: boolean;
	required?: boolean;
	start?: string;
	step?: number;
	useNativeElement?: boolean;
	value?: string;
}

export interface TimeUnits {
	hour: number;
	minute?: number;
	second?: number;
}

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
		const date = new Date(time);
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
 * @throws Error  For any string not in the format 'HH:mm' or 'HH:mm:ss'.
 * @return        An object containing `hour`, `second`, and `number` properties.
 */
export const parseUnits = (function () {
	const TIME_PATTERN = /^\d{2}:\d{2}(:\d{2})?$/;
	return function (value: string | TimeUnits): TimeUnits {
		if (typeof value === 'string') {
			if (!TIME_PATTERN.test(value)) {
				throw new Error('Time strings must be in the format HH:mm or HH:mm:ss');
			}

			const [ hour, minute, second = 0 ] = value.split(':').map(unit => parseInt(unit, 10));
			return { hour, minute, second } as TimeUnits;
		}

		return value;
	};
})();

export const TimePickerBase = ThemeableMixin(WidgetBase);

@theme(css)
export class TimePicker extends TimePickerBase<TimePickerProperties> {
	private _nativeInputNode: HTMLInputElement;

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
					bind: this,
					classes: this.classes(
						disabled ? css.disabled : null,
						invalid ? css.invalid : null,
						readOnly ? css.readonly : null,
						required ? css.required : null
					),
					formId,
					label
				}, [ input ]) ];
			}

			return v('span', {
				classes: this.classes(css.root)
			}, children);
		}

		return this.renderCustomInput();
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'native-input') {
			this._nativeInputNode = element as HTMLInputElement;
		}
	}

	protected renderNativeInput() {
		const {
			disabled,
			end,
			invalid,
			readOnly,
			required,
			start,
			value
		} = this.properties;

		const classes = [
			css.input,
			disabled ? css.disabled : null,
			invalid ? css.required : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		return v('input', {
			classes: this.classes(...classes),
			disabled,
			invalid,
			key: 'native-input',
			max: end,
			min: start,
			onBlur: this._onNativeBlur,
			onChange: this._onNativeChange,
			onFocus: this._onNativeFocus,
			readOnly,
			required,
			type: 'time',
			value
		});
	}

	protected renderCustomInput() {
		const {
			autoBlur,
			clearable,
			customOptionItem,
			customOptionMenu,
			disabled,
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
			overrideClasses,
			readOnly,
			required,
			value
		} = this.properties;

		return w(ComboBox, {
			autoBlur,
			clearable,
			customResultItem: customOptionItem,
			customResultMenu: customOptionMenu,
			disabled,
			formId,
			getResultLabel: this._getOptionLabel,
			inputProperties,
			invalid,
			isResultDisabled: isOptionDisabled,
			label,
			onBlur,
			onChange,
			onFocus,
			onMenuChange,
			onRequestResults: this._onRequestOptions,
			openOnFocus,
			overrideClasses: overrideClasses || css,
			readOnly,
			required,
			results: options,
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

	private _onNativeBlur() {
		this.properties.onBlur && this.properties.onBlur(this._nativeInputNode.value);
	}

	private _onNativeChange() {
		this.properties.onChange && this.properties.onChange(this._nativeInputNode.value);
	}

	private _onNativeFocus() {
		this.properties.onFocus && this.properties.onFocus(this._nativeInputNode.value);
	}

	private _onRequestOptions(value: string) {
		const { end, onRequestOptions, start, step } = this.properties;
		onRequestOptions && onRequestOptions(value, getOptions.bind(null, start, end, step));
	}
}

export default TimePicker;
