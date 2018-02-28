import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v, w } from '@dojo/widget-core/d';
import Focus from '@dojo/widget-core/meta/Focus';
import Label from '../label/index';
import { CustomAriaProperties, InputProperties, LabeledProperties, PointerEventProperties, KeyEventProperties, InputEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import uuid from '@dojo/core/uuid';
import * as css from '../theme/text-input.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

export type TextInputType = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url';

/**
 * @type IconProperties
 *
 * Properties that can be set on a TextInput component
 *
 * @property controls       ID of an element that this input controls
 * @property type           Input type, e.g. text, email, tel, etc.
 * @property maxLength      Maximum number of characters allowed in the input
 * @property minLength      Minimum number of characters allowed in the input
 * @property placeholder    Placeholder text
 * @property value           The current value
 */

export interface TextInputProperties extends ThemedProperties, InputProperties, LabeledProperties, PointerEventProperties, KeyEventProperties, InputEventProperties, CustomAriaProperties {
	controls?: string;
	type?: TextInputType;
	maxLength?: number | string;
	minLength?: number | string;
	placeholder?: string;
	value?: string;
	focus?: boolean;
	onClick?(value: string): void;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<TextInputProperties>({
	tag: 'dojo-text-input',
	properties: [
		'theme',
		'aria',
		'extraClasses',
		'aria',
		'focus',
		'disabled',
		'invalid',
		'readOnly'
	],
	attributes: [ 'placeholder', 'controls', 'type', 'minLength', 'maxLength', 'value', 'name' ],
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
export class TextInputBase<P extends TextInputProperties = TextInputProperties> extends ThemedBase<P, null> {
	private _onBlur (event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur((event.target as HTMLInputElement).value);
	}
	private _onChange (event: Event) {
		this.properties.onChange && this.properties.onChange((event.target as HTMLInputElement).value);
	}
	private _onClick (event: MouseEvent) {
		event.stopPropagation();
		this.properties.onClick && this.properties.onClick((event.target as HTMLInputElement).value);
	}
	private _onFocus (event: FocusEvent) {
		this.properties.onFocus && this.properties.onFocus((event.target as HTMLInputElement).value);
	}
	private _onInput (event: Event) {
		this.properties.onInput && this.properties.onInput((event.target as HTMLInputElement).value);
	}
	private _onKeyDown (event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyDown && this.properties.onKeyDown(event.which, () => { event.preventDefault(); });
	}
	private _onKeyPress (event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyPress && this.properties.onKeyPress(event.which, () => { event.preventDefault(); });
	}
	private _onKeyUp (event: KeyboardEvent) {
		event.stopPropagation();
		this.properties.onKeyUp && this.properties.onKeyUp(event.which, () => { event.preventDefault(); });
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

	private _uuid: string;

	constructor() {
		super();
		this._uuid = uuid();
	}

	protected getRootClasses(): (string | null)[] {
		const {
			disabled,
			invalid,
			readOnly,
			required
		} = this.properties;
		const focus = this.meta(Focus).get('root');
		return [
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		];
	}

	protected renderInput(): DNode {
		const {
			aria = {},
			disabled,
			id = this._uuid,
			invalid,
			maxLength,
			minLength,
			name,
			placeholder,
			readOnly,
			required,
			type = 'text',
			value,
			focus
		} = this.properties;

		if (focus) {
			this.meta(Focus).set('input');
		}

		return v('input', {
			...formatAriaProperties(aria),
			'aria-invalid': invalid ? 'true' : null,
			classes: this.theme(css.input),
			disabled,
			id,
			key: 'input',
			maxlength: maxLength ? `${maxLength}` : null,
			minlength: minLength ? `${minLength}` : null,
			name,
			placeholder,
			readOnly,
			'aria-readonly': readOnly ? 'true' : null,
			required,
			type,
			value,
			onblur: this._onBlur,
			onchange: this._onChange,
			onclick: this._onClick,
			onfocus: this._onFocus,
			oninput: this._onInput,
			onkeydown: this._onKeyDown,
			onkeypress: this._onKeyPress,
			onkeyup: this._onKeyUp,
			onmousedown: this._onMouseDown,
			onmouseup: this._onMouseUp,
			ontouchstart: this._onTouchStart,
			ontouchend: this._onTouchEnd,
			ontouchcancel: this._onTouchCancel
		});
	}

	protected renderInputWrapper(): DNode {
		return v('div', { classes: this.theme(css.inputWrapper) }, [
			this.renderInput()
		]);
	}

	protected render(): DNode {
		const {
			disabled,
			id = this._uuid,
			invalid,
			label,
			labelAfter = false,
			labelHidden = false,
			readOnly,
			required,
			theme
		} = this.properties;
		const focus = this.meta(Focus).get('root');

		const children = [
			label ? w(Label, {
				theme,
				disabled,
				focused: focus.containsFocus,
				invalid,
				readOnly,
				required,
				hidden: labelHidden,
				forId: id
			}, [ label ]) : null,
			this.renderInputWrapper()
		];

		return v('div', {
			key: 'root',
			classes: this.theme(this.getRootClasses())
		}, labelAfter ? children.reverse() : children);
	}
}

export default class TextInput extends TextInputBase<TextInputProperties> {}
