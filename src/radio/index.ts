import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '@dojo/framework/core/meta/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/radio.m.css';

/**
 * @type RadioProperties
 *
 * Properties that can be set on a Radio component
 *
 * @property checked          Checked/unchecked property of the radio
 * @property value           The current value
 */
export interface RadioProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	labelAfter?: boolean;
	labelHidden?: boolean;
	label?: string;
	onBlur?(): void;
	onValue?(checked: boolean): void;
	onFocus?(): void;
	disabled?: boolean;
	widgetId?: string;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
	checked?: boolean;
	value?: string;
	valid?: boolean;
}

@theme(css)
export class Radio extends ThemedMixin(FocusMixin(WidgetBase))<RadioProperties> {
	private _uuid = uuid();

	private _onBlur() {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onChange(event: Event) {
		event.stopPropagation();
		const radio = event.target as HTMLInputElement;
		this.properties.onValue && this.properties.onValue(radio.checked);
	}
	private _onFocus() {
		this.properties.onFocus && this.properties.onFocus();
	}

	protected getRootClasses(): (string | null)[] {
		const { checked = false, disabled, valid, readOnly, required } = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === true ? css.valid : null,
			valid === false ? css.invalid : null,
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
			valid,
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
					'aria-invalid': valid === false ? 'true' : null,
					name,
					readOnly,
					'aria-readonly': readOnly === true ? 'true' : null,
					required,
					type: 'radio',
					value,
					onblur: this._onBlur,
					onchange: this._onChange,
					onfocus: this._onFocus
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
							valid,
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
