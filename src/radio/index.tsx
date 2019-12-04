import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '../meta/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/default/radio.m.css';

export interface RadioProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Checked/unchecked property of the radio */
	checked?: boolean;
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Adds a <label> element with the supplied text */
	label?: string;
	/** Adds the label element after (true) or before (false) */
	labelAfter?: boolean;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** The name of the radio button */
	name?: string;
	/** Handler for when the element is blurred */
	onBlur?(): void;
	/** Handler for when the element is focused */
	onFocus?(): void;
	/** Handler for when the pointer moves out of the element */
	onOut?(): void;
	/** Handler for when the pointer moves over the element */
	onOver?(): void;
	/** Handler for when the value of the widget changes */
	onValue?(checked: boolean): void;
	/** Makes the radio readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Sets the radio input as required to complete the form */
	required?: boolean;
	/** Toggles the invalid/valid states of the Radio affecting how it is displayed */
	valid?: boolean;
	/** The current value */
	value?: string;
	/** The id used for the form input element */
	widgetId?: string;
}

@theme(css)
export class Radio extends ThemedMixin(FocusMixin(WidgetBase))<RadioProperties> {
	private _uuid = uuid();

	private _onChange(event: Event) {
		event.stopPropagation();
		const radio = event.target as HTMLInputElement;
		this.properties.onValue && this.properties.onValue(radio.checked);
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
			value,
			onOut,
			onOver,
			onBlur,
			onFocus
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
					onblur: () => {
						onBlur && onBlur();
					},
					onchange: this._onChange,
					onfocus: () => {
						onFocus && onFocus();
					},
					onpointerenter: () => {
						onOver && onOver();
					},
					onpointerleave: () => {
						onOut && onOut();
					}
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
