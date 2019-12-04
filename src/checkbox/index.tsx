import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '../meta/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/default/checkbox.m.css';

export interface CheckboxProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  Checked/unchecked property of the control */
	checked?: boolean;
	/** Set the disabled property of the control */
	disabled?: boolean;
	/** Adds a <label> element with the supplied text */
	label?: string;
	/** Adds the label element after (true) or before (false) */
	labelAfter?: boolean;
	/** Hides the label from view while still remaining accessible for screen readers */
	labelHidden?: boolean;
	/** The type of user interface to show for this Checkbox */
	mode?: Mode;
	/** The name of the checkbox */
	name?: string;
	/** Label to show in the "off" position of a toggle */
	offLabel?: DNode;
	/** Handler for when the element is blurred */
	onBlur?(): void;
	/** Handler for when the element is focused */
	onFocus?(): void;
	/** Label to show in the "on" position of a toggle */
	onLabel?: DNode;
	/** Handler for when the pointer moves out of the element */
	onOut?(): void;
	/** Handler for when the pointer moves over the element */
	onOver?(): void;
	/** Handler for when the value of the widget changes */
	onValue?(checked: boolean): void;
	/** Makes the checkbox readonly (it may be focused but not changed) */
	readOnly?: boolean;
	/** Sets the checkbox input as required to complete the form */
	required?: boolean;
	/** Toggles the invalid/valid states of the Checkbox affecting how it is displayed */
	valid?: boolean;
	/** The current value */
	value?: string;
	/** The id used for the form input element */
	widgetId?: string;
}

/**
 * The type of UI to show for this Checkbox
 */
export enum Mode {
	normal = 'normal',
	toggle = 'toggle'
}

@theme(css)
export class Checkbox extends ThemedMixin(FocusMixin(WidgetBase))<CheckboxProperties> {
	private _onChange(event: Event) {
		event.stopPropagation();
		const checkbox = event.target as HTMLInputElement;
		this.properties.onValue && this.properties.onValue(checkbox.checked);
	}

	private _uuid = uuid();

	protected getRootClasses(): (string | null)[] {
		const { checked = false, disabled, valid, mode, readOnly, required } = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			mode === Mode.toggle ? css.toggle : null,
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			valid === false ? css.invalid : null,
			valid === true ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	protected renderToggle(): DNode[] {
		const { checked, mode, onLabel, offLabel } = this.properties;

		return mode === Mode.toggle
			? [
					offLabel
						? v(
								'div',
								{
									key: 'offLabel',
									classes: this.theme(css.offLabel),
									'aria-hidden': checked ? 'true' : null
								},
								[offLabel]
						  )
						: null,
					v('div', {
						key: 'toggle',
						classes: this.theme(css.toggleSwitch)
					}),
					onLabel
						? v(
								'div',
								{
									key: 'onLabel',
									classes: this.theme(css.onLabel),
									'aria-hidden': checked ? null : 'true'
								},
								[onLabel]
						  )
						: null
			  ]
			: [];
	}

	protected render(): DNode {
		const {
			aria = {},
			classes,
			checked = false,
			disabled,
			widgetId = this._uuid,
			valid,
			label,
			labelAfter = true,
			labelHidden,
			theme,
			name,
			readOnly,
			required,
			onFocus,
			onBlur,
			onOver,
			onOut
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		const children = [
			v('div', { classes: this.theme(css.inputWrapper) }, [
				...this.renderToggle(),
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
					type: 'checkbox',
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
				})
			]),
			label
				? w(
						Label,
						{
							key: 'label',
							classes,
							theme,
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

export default Checkbox;
