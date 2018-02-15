import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import Focus from '@dojo/widget-core/meta/Focus';
import Label from '../label/Label';
import { CustomAriaProperties, LabeledProperties, InputProperties, InputEventProperties, KeyEventProperties, PointerEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { v, w } from '@dojo/widget-core/d';
import uuid from '@dojo/core/uuid';
import * as css from '../theme/checkbox/checkbox.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

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
export interface CheckboxProperties extends ThemedProperties, InputProperties, LabeledProperties, InputEventProperties, KeyEventProperties, PointerEventProperties, CustomAriaProperties {
	checked?: boolean;
	mode?: Mode;
	offLabel?: DNode;
	onLabel?: DNode;
	value?: string;
}

/**
 * The type of UI to show for this Checkbox
 */
export const enum Mode {
	normal,
	toggle
};

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<CheckboxProperties>({
	tag: 'dojo-checkbox',
	properties: [ 'theme', 'aria', 'extraClasses', 'labelAfter', 'labelHidden', 'checked', 'mode', 'offLabel', 'onLabel' ],
	attributes: [ 'label', 'value' ],
	events: [
		'onBlur',
		'onChange',
		'onClick',
		'onFocus',
		'onInput',
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
export class CheckboxBase<P extends CheckboxProperties = CheckboxProperties> extends ThemedBase<P, null> {
	private _onBlur (event: FocusEvent) { this.properties.onBlur && this.properties.onBlur(event); }
	private _onChange (event: Event) { this.properties.onChange && this.properties.onChange(event); }
	private _onClick (event: MouseEvent) { this.properties.onClick && this.properties.onClick(event); }
	private _onFocus (event: FocusEvent) { this.properties.onFocus && this.properties.onFocus(event); }
	private _onMouseDown (event: MouseEvent) { this.properties.onMouseDown && this.properties.onMouseDown(event); }
	private _onMouseUp (event: MouseEvent) { this.properties.onMouseUp && this.properties.onMouseUp(event); }
	private _onTouchStart (event: TouchEvent) { this.properties.onTouchStart && this.properties.onTouchStart(event); }
	private _onTouchEnd (event: TouchEvent) { this.properties.onTouchEnd && this.properties.onTouchEnd(event); }
	private _onTouchCancel (event: TouchEvent) { this.properties.onTouchCancel && this.properties.onTouchCancel(event); }

	private _uuid = uuid();

	protected getRootClasses(): (string | null)[] {
		const {
			checked = false,
			disabled,
			invalid,
			mode,
			readOnly,
			required
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			mode === Mode.toggle ? css.toggle : null,
			checked ? css.checked : null,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
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
				...this.renderToggle(),
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
			]),
			label ? w(Label, {
				key: 'label',
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

export default class Checkbox extends CheckboxBase<CheckboxProperties> {}
