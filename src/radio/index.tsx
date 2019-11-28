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
	/**  */
	checked?: boolean;
	/**  */
	disabled?: boolean;
	/**  */
	label?: string;
	/**  */
	labelAfter?: boolean;
	/**  */
	labelHidden?: boolean;
	/**  */
	name?: string;
	/**  */
	onBlur?(): void;
	/**  */
	onFocus?(): void;
	/**  */
	onOut?(): void;
	/**  */
	onOver?(): void;
	/**  */
	onValue?(checked: boolean): void;
	/**  */
	readOnly?: boolean;
	/**  */
	required?: boolean;
	/**  */
	valid?: boolean;
	/**  */
	value?: string;
	/**  */
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
