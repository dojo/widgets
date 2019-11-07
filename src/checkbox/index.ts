import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '../meta/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/checkbox.m.css';

export interface CheckboxProperties extends ThemedProperties, FocusProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/**  Checked/unchecked property of the radio */
	checked?: boolean;
	disabled?: boolean;
	label?: string;
	labelAfter?: boolean;
	labelHidden?: boolean;
	/** The type of user interface to show for this Checkbox */
	mode?: Mode;
	name?: string;
	/** Label to show in the "off" positin of a toggle */
	offLabel?: DNode;
	onBlur?(): void;
	onFocus?(): void;
	/** Label to show in the "on" positin of a toggle */
	onLabel?: DNode;
	onOut?(): void;
	onOver?(): void;
	onValue?(checked: boolean): void;
	readOnly?: boolean;
	required?: boolean;
	valid?: boolean;
	/** The current value */
	value?: string;
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
