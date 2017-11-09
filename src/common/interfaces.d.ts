export interface LabeledProperties {
	labelAfter?: boolean;
	labelHidden?: boolean;
	label?: string;
}

/**
 * @type InputProperties
 *
 * Properties that can be set on a input component
 *
 * @property controls       ID of an element that this input controls
 * @property describedBy    ID of an element that provides more descriptive text
 * @property disabled       Prevents the user from interacting with the form field
 * @property invalid        Indicates the value entered in the form field is invalid
 * @property maxLength      Maximum number of characters allowed in the input
 * @property minLength      Minimum number of characters allowed in the input
 * @property name           The form widget's name
 * @property placeholder    Placeholder text
 * @property readOnly       Allows or prevents user interaction
 * @property required       Whether or not a value is required
 * @property type           Input type, e.g. text, email, tel, etc.
 * @property value          The current value
 * @property onBlur         Called when the input loses focus
 * @property onChange       Called when the node's 'change' event is fired
 * @property onClick        Called when the input is clicked
 * @property onFocus        Called when the input is focused
 * @property onInput        Called when the 'input' event is fired
 * @property onKeyDown      Called on the input's keydown event
 * @property onKeyPress     Called on the input's keypress event
 * @property onKeyUp        Called on the input's keyup event
 * @property onMouseDown    Called on the input's mousedown event
 * @property onMouseUp      Called on the input's mouseup event
 * @property onTouchStart   Called on the input's touchstart event
 * @property onTouchEnd     Called on the input's touchend event
 * @property onTouchCancel  Called on the input's touchcancel event
 */
export interface InputProperties extends InputEventProperties {
	describedBy?: string;
	disabled?: boolean;
	invalid?: boolean;
	maxLength?: number | string;
	minLength?: number | string;
	name?: string;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	value?: string;
	onInput?(event: Event): void;
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
}

export interface InputEventProperties {
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onClick?(event: MouseEvent): void;
	onFocus?(event: FocusEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}
