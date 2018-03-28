import commonBundle from './nls/common';

export type CommonMessages = typeof commonBundle.messages;

export type AriaPropertyObject = {
	[key: string]: string;
};

export interface CustomAriaProperties {
	aria?: AriaPropertyObject;
}

/**
 * @type InputProperties
 *
 * Properties that can be set on a input component
 *
 * @property disabled       Prevents the user from interacting with the form field
 * @property widgetId        Adds an id property to the input node so custom labels are possible
 * @property invalid        Indicates the value entered in the form field is invalid
 * @property name           The form widget's name
 * @property readOnly       Allows or prevents user interaction
 * @property required       Whether or not a value is required
 */
export interface InputProperties {
	disabled?: boolean;
	widgetId?: string;
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
	onBlur?(value?: string | number | boolean): void;
	onChange?(value?: string | number | boolean): void;
	onFocus?(value?: string | number | boolean): void;
	onInput?(value?: string | number | boolean): void;
}

export interface CheckboxRadioEventProperties {
	onBlur?(value: string, checked: boolean): void;
	onChange?(value: string, checked: boolean): void;
	onFocus?(value: string, checked: boolean): void;
	onClick?(value: string, checked: boolean): void;
}

/**
 * @type KeyEventProperties
 * @property onKeyDown      Called on the input's keydown event
 * @property onKeyPress     Called on the input's keypress event
 * @property onKeyUp        Called on the input's keyup event
 */
export interface KeyEventProperties {
	onKeyDown?(key: number, preventDefault: () => void): void;
	onKeyPress?(key: number, preventDefault: () => void): void;
	onKeyUp?(key: number, preventDefault: () => void): void;
}

/**
 * @type LabeledProperties
 * @property labelAfter     If false, moves the label before the input
 * @property labelHidden    If true, the label will be accessible but visually hidden
 * @property label          String value for the label
 */
export interface LabeledProperties {
	labelAfter?: boolean;
	labelHidden?: boolean;
	label?: string;
}

/**
 * @type PointerEventProperties
 * @property onMouseDown    Called on the input's mousedown event
 * @property onMouseUp      Called on the input's mouseup event
 * @property onTouchStart   Called on the input's touchstart event
 * @property onTouchEnd     Called on the input's touchend event
 * @property onTouchCancel  Called on the input's touchcancel event
 */
export interface PointerEventProperties {
	onMouseDown?(): void;
	onMouseUp?(): void;
	onTouchStart?(): void;
	onTouchEnd?(): void;
	onTouchCancel?(): void;
}
