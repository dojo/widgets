import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import Label, { LabelOptions } from '../label/Label';
import * as css from './styles/textarea.css';

/**
 * @type TextareaProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property columns         Number of columns, controls the width of the textarea
 * @property describedBy     ID of an element that provides more descriptive text
 * @property disabled        Prevents the user from interacting with the form field
 * @property formId          ID of a form element associated with the form field
 * @property invalid         Indicates the value entered in the form field is invalid
 * @property label           Label settings for form label text, position, and visibility
 * @property maxLength       Maximum number of characters allowed in the input
 * @property minLength       Minimum number of characters allowed in the input
 * @property name            The form widget's name
 * @property placeholder     Placeholder text
 * @property readOnly        Allows or prevents user interaction
 * @property required        Whether or not a value is required
 * @property rows            Number of rows, controls the height of the textarea
 * @property value           The current value
 * @property wrapText        Controls text wrapping. Can be "hard", "soft", or "off"
 * @property onBlur          Called when the input loses focus
 * @property onChange        Called when the node's 'change' event is fired
 * @property onClick         Called when the input is clicked
 * @property onFocus         Called when the input is focused
 * @property onInput         Called when the 'input' event is fired
 * @property onKeyDown       Called on the input's keydown event
 * @property onKeyPress      Called on the input's keypress event
 * @property onKeyUp         Called on the input's keyup event
 * @property onMouseDown     Called on the input's mousedown event
 * @property onMouseUp       Called on the input's mouseup event
 * @property onTouchStart    Called on the input's touchstart event
 * @property onTouchEnd      Called on the input's touchend event
 * @property onTouchCancel   Called on the input's touchcancel event
 */
export interface TextareaProperties extends ThemeableProperties {
	columns?: number;
	describedBy?: string;
	disabled?: boolean;
	formId?: string;
	invalid?: boolean;
	label?: string | LabelOptions;
	maxLength?: number | string;
	minLength?: number | string;
	name?: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	rows?: number;
	value?: string;
	wrapText?: 'hard' | 'soft' | 'off';
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onInput?(event: Event): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

export const TextareaBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Textarea extends TextareaBase<TextareaProperties> {
	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onInput (event: Event) { this.properties.onInput && this.properties.onInput(event); }
	private _onKeyDown (event: KeyboardEvent) { this.properties.onKeyDown && this.properties.onKeyDown(event); }
	private _onKeyPress (event: KeyboardEvent) { this.properties.onKeyPress && this.properties.onKeyPress(event); }
	private _onKeyUp (event: KeyboardEvent) { this.properties.onKeyUp && this.properties.onKeyUp(event); }
	private _onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	private _onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	private _onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	private _onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	private _onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	render(): DNode {
		const {
			columns,
			describedBy,
			disabled,
			formId,
			invalid,
			label,
			maxLength,
			minLength,
			name,
			placeholder,
			readOnly,
			required,
			rows,
			value,
			wrapText
		} = this.properties;

		const stateClasses = [
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];

		const textarea = v('div', { classes: this.classes(css.inputWrapper) }, [
			v('textarea', {
				bind: this,
				classes: this.classes(css.input),
				cols: columns ? columns + '' : null,
				'aria-describedby': describedBy,
				disabled,
				'aria-invalid': invalid + '',
				maxlength: maxLength ? maxLength + '' : null,
				minlength: minLength ? minLength + '' : null,
				name,
				placeholder,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				rows: rows ? rows + '' : null,
				value,
				wrap: wrapText,
				onblur: this._onBlur,
				onchange: this._onChange,
				onclick: this._onClick,
				onfocus: this._onFocus,
				oninput: this._onInput,
				onkeydown: this._onKeyDown,
				onkeypress: this._onKeyPress,
				onkeyup: this._onKeyUp,
				onmousedown: this._onMouseDown,
				onmouseup: this._onMouseUp,
				ontouchstart: this._onTouchStart,
				ontouchend: this._onTouchEnd,
				ontouchcancel: this._onTouchCancel
			})
		]);

		let textareaWidget;

		if (label) {
			textareaWidget = w(Label, {
				classes: this.classes(css.root, ...stateClasses),
				formId,
				label
			}, [ textarea ]);
		}
		else {
			textareaWidget = v('div', {
				classes: this.classes(css.root, ...stateClasses)
			}, [ textarea ]);
		}

		return textareaWidget;
	}
}
