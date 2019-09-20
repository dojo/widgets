import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '@dojo/framework/core/meta/Focus';
import Label from '../label/index';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/checkbox.m.css';

/**
 * @type CheckboxProperties
 *
 * Properties that can be set on a Checkbox component
 *
 * @property checked        Checked/unchecked property of the radio
 * @property mode           The type of user interface to show for this Checkbox
 * @property offLabel       Label to show in the "off" positin of a toggle
 * @property onLabel        Label to show in the "on" positin of a toggle
 * @property value           The current value
 */
export interface CheckboxProperties extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	checked?: boolean;
	disabled?: boolean;
	label?: string;
	labelAfter?: boolean;
	labelHidden?: boolean;
	mode?: Mode;
	name?: string;
	offLabel?: DNode;
	onBlur?(): void;
	onFocus?(): void;
	onLabel?: DNode;
	onValue?(checked: boolean): void;
	readOnly?: boolean;
	required?: boolean;
	valid?: boolean;
	id?: string;
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
	private _onBlur() {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onChange(event: Event) {
		event.stopPropagation();
		const checkbox = event.target as HTMLInputElement;
		this.properties.onValue && this.properties.onValue(checkbox.checked);
	}
	private _onFocus() {
		this.properties.onFocus && this.properties.onFocus();
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
			id = this._uuid,
			valid,
			label,
			labelAfter = true,
			labelHidden,
			theme,
			name,
			readOnly,
			required
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		const children = [
			v('div', { classes: this.theme(css.inputWrapper) }, [
				...this.renderToggle(),
				v('input', {
					id,
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
					onblur: this._onBlur,
					onchange: this._onChange,
					onfocus: this._onFocus
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
							forId: id,
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
