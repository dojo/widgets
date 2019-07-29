import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '@dojo/framework/core/meta/Focus';
import Label from '../label/index';
import {
	CustomAriaProperties,
	LabeledProperties,
	InputProperties,
	KeyEventProperties,
	CheckboxRadioEventProperties,
	PointerEventProperties
} from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/radio.m.css';
import { customElement } from '@dojo/framework/core/decorators/customElement';

/**
 * @type RadioProperties
 *
 * Properties that can be set on a Radio component
 *
 * @property checked          Checked/unchecked property of the radio
 * @property value           The current value
 */
export interface RadioProperties
	extends ThemedProperties,
		LabeledProperties,
		InputProperties,
		FocusProperties,
		KeyEventProperties,
		PointerEventProperties,
		CustomAriaProperties,
		CheckboxRadioEventProperties {
	checked?: boolean;
	value?: string;
}

@theme(css)
@customElement<RadioProperties>({
	tag: 'dojo-radio',
	properties: [
		'required',
		'invalid',
		'readOnly',
		'disabled',
		'theme',
		'classes',
		'aria',
		'extraClasses',
		'checked',
		'labelAfter',
		'labelHidden'
	],
	attributes: ['widgetId', 'label', 'value', 'name'],
	events: [
		'onBlur',
		'onChange',
		'onClick',
		'onFocus',
		'onKeyDown',
		'onKeyPress',
		'onKeyUp',
		'onMouseDown',
		'onMouseUp',
		'onTouchCancel',
		'onTouchEnd',
		'onTouchStart'
	]
})
export class Radio extends ThemedMixin(FocusMixin(WidgetBase))<RadioProperties> {
	private _uuid = uuid();

	private _onBlur(event: FocusEvent) {
		const radio = event.target as HTMLInputElement;
		this.properties.onBlur && this.properties.onBlur(radio.value, radio.checked);
	}
	private _onChange(event: Event) {
		event.stopPropagation();
		const radio = event.target as HTMLInputElement;
		this.properties.onChange && this.properties.onChange(radio.value, radio.checked);
	}
	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		const radio = event.target as HTMLInputElement;
		this.properties.onClick && this.properties.onClick(radio.value, radio.checked);
	}
	private _onFocus(event: FocusEvent) {
		const radio = event.target as HTMLInputElement;
		this.properties.onFocus && this.properties.onFocus(radio.value, radio.checked);
	}
	private _onMouseDown(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseDown && this.properties.onMouseDown();
	}
	private _onMouseUp(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onMouseUp && this.properties.onMouseUp();
	}
	private _onTouchStart(event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchStart && this.properties.onTouchStart();
	}
	private _onTouchEnd(event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchEnd && this.properties.onTouchEnd();
	}
	private _onTouchCancel(event: TouchEvent) {
		event.stopPropagation();
		this.properties.onTouchCancel && this.properties.onTouchCancel();
	}

	protected getRootClasses(): (string | null)[] {
		const { checked = false, disabled, invalid, readOnly, required } = this.properties;
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
			widgetId = this._uuid,
			invalid,
			label,
			labelAfter = true,
			labelHidden,
			theme,
			classes,
			name,
			readOnly,
			required,
			value
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		const children = [
			v('div', { classes: this.theme(css.inputWrapper) }, [
				v('input', {
					id: widgetId,
					...formatAriaProperties(aria),
					classes: this.theme(css.input),
					checked,
					disabled,
					focus: this.shouldFocus,
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
				}),
				v(
					'div',
					{
						classes: this.theme(css.radioBackground)
					},
					[
						v('div', { classes: this.theme(css.radioOuter) }),
						v('div', { classes: this.theme(css.radioInner) })
					]
				)
			]),
			label
				? w(
						Label,
						{
							theme,
							classes,
							disabled,
							focused: focus.containsFocus,
							invalid,
							readOnly,
							required,
							hidden: labelHidden,
							forId: widgetId,
							secondary: true
						},
						[label]
				  )
				: null
		];

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme(this.getRootClasses())
			},
			labelAfter ? children : children.reverse()
		);
	}
}

export default Radio;
