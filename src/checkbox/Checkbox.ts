import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Label, { LabelOptions, parseLabelClasses } from '../label/Label';
import { v, w } from '@dojo/widget-core/d';
import * as css from './styles/checkbox.m.css';

/**
 * @type CheckboxProperties
 *
 * Properties that can be set on a Checkbox component
 *
 * @property checked        Checked/unchecked property of the radio
 * @property describedBy    ID of an element that provides more descriptive text
 * @property disabled       Prevents the user from interacting with the form field
 * @property invalid        Indicates the valid is invalid, or required and not filled in
 * @property label          Label settings for form label text, position, and visibility
 * @property mode           The type of user interface to show for this Checkbox
 * @property name           The form widget's name
 * @property offLabel       Label to show in the "off" positin of a toggle
 * @property onLabel        Label to show in the "on" positin of a toggle
 * @property readOnly       Allows or prevents user interaction
 * @property required       Whether or not a value is required
 * @property value          The current value
 * @property onBlur         Called when the input loses focus
 * @property onChange       Called when the node's 'change' event is fired
 * @property onClick        Called when the input is clicked
 * @property onFocus        Called when the input is focused
 * @property onMouseDown    Called on the input's mousedown event
 * @property onMouseUp      Called on the input's mouseup event
 * @property onTouchStart   Called on the input's touchstart event
 * @property onTouchEnd     Called on the input's touchend event
 * @property onTouchCancel  Called on the input's touchcancel event
 */
export interface CheckboxProperties extends ThemedProperties {
	checked?: boolean;
	describedBy?: string;
	disabled?: boolean;
	invalid?: boolean;
	label?: string | LabelOptions;
	mode?: Mode;
	name?: string;
	offLabel?: DNode;
	onLabel?: DNode;
	readOnly?: boolean;
	required?: boolean;
	value?: string;
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

/**
 * The type of UI to show for this Checkbox
 */
export const enum Mode {
	normal,
	toggle
};

export const CheckboxBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Checkbox extends CheckboxBase<CheckboxProperties> {
	private _focused = false;
	private _onBlur (event: FocusEvent) {
		this._focused = false;
		this.properties.onBlur && this.properties.onBlur(event);
		this.invalidate();
	}
	private _onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) {
		this._focused = true;
		this.properties.onFocus && this.properties.onFocus(event);
		this.invalidate();
	}
	private _onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	private _onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	private _onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	private _onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	private _onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	protected getModifierClasses(): (string | null)[] {
		const {
			checked = false,
			disabled,
			invalid,
			mode,
			readOnly,
			required
		} = this.properties;

		return [
			mode === Mode.toggle ? css.toggle : null,
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			this._focused ? css.focused : null,
			invalid ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	protected renderToggle(): DNode[] {
		const {
			checked,
			mode,
			onLabel,
			offLabel
		} = this.properties;

		return mode === Mode.toggle ? [
			offLabel ? v('div', {
				key: 'offLabel',
				classes: this.theme(css.offLabel),
				'aria-hidden': checked ? 'true' : null
			}, [ offLabel ]) : null,
			v('div', {
				key: 'toggle',
				classes: this.theme(css.toggleSwitch)
			}),
			onLabel ? v('div', {
				key: 'onLabel',
				classes: this.theme(css.onLabel),
				'aria-hidden': checked ? null : 'true'
			}, [ onLabel ]) : null
		] : [];
	}

	protected render(): DNode {
		const {
			checked = false,
			describedBy,
			disabled,
			invalid,
			label,
			name,
			readOnly,
			required,
			value
		} = this.properties;

		const children = [
			v('div', { classes: this.theme(css.inputWrapper) }, [
				...this.renderToggle(),
				v('input', {
					classes: this.theme(css.input),
					checked,
					'aria-describedby': describedBy,
					disabled,
					'aria-invalid': invalid ? 'true' : null,
					name,
					readOnly,
					'aria-readonly': readOnly ? 'true' : null,
					required,
					type: 'checkbox',
					value,
					onblur: this._onBlur,
					onchange: this._onChange,
					onclick: this._onClick,
					onfocus: this._onFocus,
					onmousedown: this._onMouseDown,
					onmouseup: this._onMouseUp,
					ontouchstart: this._onTouchStart,
					ontouchend: this._onTouchEnd,
					ontouchcancel: this._onTouchCancel
				})
			])
		];

		let checkboxWidget;

		if (label) {
			checkboxWidget = w(Label, {
				extraClasses: { root: parseLabelClasses(this.theme([ css.root, ...this.getModifierClasses() ])) },
				label,
				theme: this.properties.theme
			}, children);
		}
		else {
			checkboxWidget = v('div', {
				classes: this.theme([ css.root, ...this.getModifierClasses() ])
			}, children);
		}

		return checkboxWidget;
	}
}
