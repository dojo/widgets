import commonBundle from './nls/common';

export type CommonMessages = typeof commonBundle.messages;

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
 * @property describedBy    ID of an element that provides more descriptive text
 * @property disabled       Prevents the user from interacting with the form field
 * @property invalid        Indicates the value entered in the form field is invalid
 * @property name           The form widget's name
 * @property readOnly       Allows or prevents user interaction
 * @property required       Whether or not a value is required
 */
export interface InputProperties {
	describedBy?: string;
	disabled?: boolean;
	invalid?: boolean;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
}

/**
 * @type InputEventProperties
 * @property onBlur         Called when the input loses focus
 * @property onChange       Called when the node's 'change' event is fired
 * @property onFocus        Called when the input is focused
 * @property onInput        Called when the 'input' event is fired
 */
export interface InputEventProperties {
	onBlur?(event: FocusEvent): void;
	onChange?(event: Event): void;
	onFocus?(event: FocusEvent): void;
	onInput?(event: Event): void;
}

/**
 * @type PointerEventProperties
 * @property onClick        Called when the input is clicked
 * @property onMouseDown    Called on the input's mousedown event
 * @property onMouseUp      Called on the input's mouseup event
 * @property onTouchStart   Called on the input's touchstart event
 * @property onTouchEnd     Called on the input's touchend event
 * @property onTouchCancel  Called on the input's touchcancel event
 */
export interface PointerEventProperties {
	onClick?(event: MouseEvent): void;
	onMouseDown?(event: MouseEvent): void;
	onMouseUp?(event: MouseEvent): void;
	onTouchStart?(event: TouchEvent): void;
	onTouchEnd?(event: TouchEvent): void;
	onTouchCancel?(event: TouchEvent): void;
}

/**
 * @type KeyEventProperties
 * @property onKeyDown      Called on the input's keydown event
 * @property onKeyPress     Called on the input's keypress event
 * @property onKeyUp        Called on the input's keyup event
 */
export interface KeyEventProperties {
	onKeyDown?(event: KeyboardEvent): void;
	onKeyPress?(event: KeyboardEvent): void;
	onKeyUp?(event: KeyboardEvent): void;
}
