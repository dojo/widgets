import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Focus from '@dojo/widget-core/meta/Focus';
import Label from '../label/Label';
import { CustomAriaProperties, LabeledProperties, InputProperties, CheckboxRadioEventProperties, PointerEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import * as css from '../theme/radio/radio.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * @type RadioProperties
 *
 * Properties that can be set on a Radio component
 *
 * @property checked          Checked/unchecked property of the radio
 * @property value           The current value
 */
export interface RadioProperties extends ThemedProperties, LabeledProperties, InputProperties, PointerEventProperties, CustomAriaProperties, CheckboxRadioEventProperties {
	checked?: boolean;
	value?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<RadioProperties>({
	tag: 'dojo-radio',
	properties: [ 'theme', 'aria', 'extraClasses', 'checked' ],
	attributes: [ 'value' ],
	events: [
		'onBlur',
		'onChange',
		'onClick',
		'onFocus',
		'onMouseDown',
		'onMouseUp',
		'onTouchCancel',
		'onTouchEnd',
		'onTouchStart'
	]
})
export class RadioBase<P extends RadioProperties = RadioProperties> extends ThemedBase<P, null> {
	private _uuid = uuid();

	private _onBlur (event: FocusEvent) {
		const radio = event.target as HTMLInputElement;
		this.properties.onBlur && this.properties.onBlur(radio.value, radio.checked);
	}
	private _onChange (event: Event) {
		const radio = event.target as HTMLInputElement;
		this.properties.onChange && this.properties.onChange(radio.value, radio.checked);
	}
	private _onClick (event: MouseEvent) {
		event.stopPropagation();
		const radio = event.target as HTMLInputElement;
		this.properties.onClick && this.properties.onClick(radio.value, radio.checked);
	}
	private _onFocus (event: FocusEvent) {
		const radio = event.target as HTMLInputElement;
		this.properties.onFocus && this.properties.onFocus(radio.value, radio.checked);
	}
	private _onMouseDown (event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseDown && this.properties.onMouseDown();
	}
	private _onMouseUp (event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseUp && this.properties.onMouseUp();
	}
	private _onTouchStart (event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchStart && this.properties.onTouchStart();
	}
	private _onTouchEnd (event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchEnd && this.properties.onTouchEnd();
	}
	private _onTouchCancel (event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchCancel && this.properties.onTouchCancel();
	}

	protected getRootClasses(): (string | null)[] {
		const {
			checked = false,
			disabled,
			invalid,
			readOnly,
			required
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	render(): DNode {
		const {
			aria = {},
			checked = false,
			disabled,
			id = this._uuid,
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
		const focus = this.meta(Focus).get('root');

		const children = [
			v('div', { classes: this.theme(css.inputWrapper) }, [
				v('input', {
					id,
					...formatAriaProperties(aria),
					classes: this.theme(css.input),
					checked,
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
				focused: focus.containsFocus,
				invalid,
				readOnly,
				required,
				hidden: labelHidden,
				forId: id,
				secondary: true
			}, [ label ]) : null
		];

		return v('div', {
			key: 'root',
			classes: this.theme(this.getRootClasses())
		}, labelAfter ? children : children.reverse());
	}
}

export default class Radio extends RadioBase<RadioProperties> {}
