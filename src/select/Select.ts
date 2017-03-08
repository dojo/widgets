import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import Label, { LabelOptions } from '../label/Label';
import * as css from './styles/select.css';

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property describedBy	ID of an element that provides more descriptive text
 * @property disabled			Prevents the user from interacting with the form field
 * @property formId				ID of a form element associated with the form field
 * @property invalid			Indicates the value entered in the form field is invalid
 * @property label				Label settings for form label text, position, and visibility
 * @property name					The form widget's name
 * @property options	object of select options in the format [key: value]: option name
 * @property readOnly			Allows or prevents user interaction
 * @property required			Whether or not a value is required
 * @property value				The current value
 * @property onBlur				Called when the input loses focus
 * @property onChange			Called when the node's 'change' event is fired
 * @property onClick			Called when the input is clicked
 * @property onFocus			Called when the input is focused
 * @property onKeyDown		Called on the input's keydown event
 * @property onKeyPress		Called on the input's keypress event
 * @property onKeyUp			Called on the input's keyup event
 * @property onMouseDown	Called on the input's mousedown event
 * @property onMouseUp		Called on the input's mouseup event
 * @property onTouchStart	Called on the input's touchstart event
 * @property onTouchEnd		Called on the input's touchend event
 * @property onTouchCancel	Called on the input's touchcancel event
 */
export interface SelectProperties extends ThemeableProperties {
	describedBy?: string;
	disabled?: boolean;
	formId?: string;
	invalid?: boolean;
	label?: string | LabelOptions;
	name?: string;
	options?: { [key: string]: string };
	readOnly?: boolean;
	required?: boolean;
	value?: string;
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

export const SelectBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Select extends SelectBase<SelectProperties> {
	onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }
	onKeyPress (event: KeyboardEvent) { this.properties.onKeyPress && this.properties.onKeyPress(event); }
	onKeyUp (event: KeyboardEvent) { this.properties.onKeyUp && this.properties.onKeyUp(event); }
	onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	render() {
		const {
			describedBy,
			disabled,
			formId,
			invalid,
			label,
			name,
			options = {},
			readOnly,
			required,
			value
		} = this.properties;

		const stateClasses = [
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		/* create option nodes */
		const optionNodes = [];
		for (let key in options) {
			optionNodes.push(v('option', {
				value: key,
				innerHTML: options[key]
			}));
		}

		const select = v('div', { classes: this.classes(css.inputWrapper) }, [
			v('select', {
				bind: this,
				classes: this.classes(css.root),
				'aria-describedby': describedBy,
				disabled,
				'aria-invalid': invalid + '',
				name,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				value,
				onblur: this.onBlur,
				onchange: this.onChange,
				onclick: this.onClick,
				onfocus: this.onFocus,
				onkeydown: this.onKeyDown,
				onkeypress: this.onKeyPress,
				onkeyup: this.onKeyUp,
				onmousedown: this.onMouseDown,
				onmouseup: this.onMouseUp,
				ontouchstart: this.onTouchStart,
				ontouchend: this.onTouchEnd,
				ontouchcancel: this.onTouchCancel
			}, optionNodes),
			v('span', {
				classes: this.classes(css.arrow)
			})
		]);

		let selectWidget;

		if (label) {
			selectWidget = w(Label, {
				classes: this.classes(css.label, ...stateClasses),
				formId,
				label
			}, [ select ]);
		}
		else {
			selectWidget = v('div', {
				classes: this.classes(...stateClasses)
			}, [ select ]);
		}

		return selectWidget;
	}
}
