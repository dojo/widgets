import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import Label from '../label/Label';
import { InputProperties, LabeledProperties } from '../common/interfaces';
import uuid from '@dojo/core/uuid';
import * as css from './styles/textarea.m.css';

/**
 * @type TextareaProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property columns         Number of columns, controls the width of the textarea
 * @property describedBy     ID of an element that provides more descriptive text
 * @property disabled        Prevents the user from interacting with the form field
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
export interface TextareaProperties extends ThemedProperties, InputProperties, LabeledProperties {
	columns?: number;
	rows?: number;
	wrapText?: 'hard' | 'soft' | 'off';
}

export const TextareaBase = ThemedMixin(WidgetBase);

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

	private _uuid: string;

	constructor() {
		super();
		this._uuid = uuid();
	}

	protected getRootClasses(): (string | null)[] {
		const {
			disabled,
			invalid,
			readOnly,
			required
		} = this.properties;
		return [
			css.root,
			disabled ? css.disabled : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	render(): DNode {
		const {
			columns,
			describedBy,
			disabled,
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
			wrapText,
			theme,
			labelHidden,
			labelAfter
		} = this.properties;

		const children = [
			label ? w(Label, { theme, disabled, invalid, readOnly, required, hidden: labelHidden, forId: this._uuid }, [ label ]) : null,
			v('textarea', {
				id: this._uuid,
				key: 'input',
				classes: this.theme(css.input),
				cols: columns ? `${columns}` : null,
				'aria-describedby': describedBy,
				disabled,
				'aria-invalid': invalid ? 'true' : null,
				maxlength: maxLength ? `${maxLength}` : null,
				minlength: minLength ? `${minLength}` : null,
				name,
				placeholder,
				readOnly,
				'aria-readonly': readOnly ? 'true' : null,
				required,
				rows: rows ? `${rows}` : null,
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
		];

		return v('div', {
			key: 'root',
			classes: this.theme(this.getRootClasses())
		}, labelAfter ? children.reverse() : children);
	}
}
