import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Label from '../label/Label';
import { LabeledProperties, InputProperties, InputEventProperties, PointerEventProperties } from '../common/interfaces';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import * as css from './styles/radio.m.css';

/**
 * @type RadioProperties
 *
 * Properties that can be set on a Radio component
 *
 * @property checked          Checked/unchecked property of the radio
 * @property value           The current value
 */
export interface RadioProperties extends ThemedProperties, LabeledProperties, InputProperties, InputEventProperties, PointerEventProperties {
	checked?: boolean;
	value?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Radio<P extends RadioProperties = RadioProperties> extends ThemedBase<P, null> {
	private _focused = false;
	private _uuid = uuid();

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

	protected getRootClasses(): (string | null)[] {
		const {
			checked = false,
			disabled,
			invalid,
			readOnly,
			required
		} = this.properties;

		return [
			css.root,
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			this._focused ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	render(): DNode {
		const {
			checked = false,
			describedBy,
			disabled,
			invalid,
			label,
			labelAfter = true,
			labelHidden,
			theme,
			name,
			readOnly,
			required,
			value
		} = this.properties;

		const children = [
			v('div', { classes: this.theme(css.inputWrapper) }, [
				v('input', {
					id: this._uuid,
					classes: this.theme(css.input),
					checked,
					'aria-describedby': describedBy,
					disabled,
					'aria-invalid': invalid === true ? 'true' : null,
					name,
					readOnly,
					'aria-readonly': readOnly === true ? 'true' : null,
					required,
					type: 'radio',
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
			]),
			label ? w(Label, {
				theme,
				disabled,
				invalid,
				readOnly,
				required,
				hidden: labelHidden,
				forId: this._uuid,
				secondary: true
			}, [ label ]) : null
		];

		return v('div', {
			key: 'root',
			classes: this.theme(this.getRootClasses())
		}, labelAfter ? children : children.reverse());
	}
}
