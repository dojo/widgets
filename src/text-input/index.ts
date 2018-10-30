import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { DNode, PropertyChangeRecord } from '@dojo/framework/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { v, w } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import { FocusMixin, FocusProperties } from '@dojo/framework/widget-core/mixins/Focus';
import Label from '../label/index';
import { CustomAriaProperties, InputProperties, LabeledProperties, PointerEventProperties, KeyEventProperties, InputEventProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-input.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import diffProperty from '@dojo/framework/widget-core/decorators/diffProperty';

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

export interface TextInputProperties extends ThemedProperties, InputProperties, FocusProperties, LabeledProperties, PointerEventProperties, KeyEventProperties, InputEventProperties, CustomAriaProperties {
	controls?: string;
	type?: TextInputType;
	maxLength?: number | string;
	minLength?: number | string;
	placeholder?: string;
	value?: string;
	pattern?: string | RegExp;
	autocomplete?: boolean | string;
	onClick?(value: string): void;
	leading?: DNode;
	trailing?: DNode;
}

export const ThemedBase = ThemedMixin(FocusMixin(WidgetBase));

function formatAutocomplete(autocomplete: string | boolean | undefined): string | undefined {
	if (typeof autocomplete === 'boolean') {
		return autocomplete ? 'on' : 'off';
	}
	return autocomplete;
}

function patternDiff(previousProperty: string | undefined, newProperty: string | RegExp | undefined): PropertyChangeRecord {
	const value = newProperty instanceof RegExp ? newProperty.source : newProperty;
	return {
		changed: previousProperty !== value,
		value
	};
}

@theme(css)
@customElement<TextInputProperties>({
	tag: 'dojo-text-input',
	properties: [
		'theme',
		'classes',
		'aria',
		'extraClasses',
		'disabled',
		'invalid',
		'readOnly',
		'labelAfter',
		'labelHidden'
	],
	attributes: [
		'widgetId',
		'label',
		'placeholder',
		'controls',
		'type',
		'minLength',
		'maxLength',
		'value',
		'name',
		'pattern',
		'autocomplete'
	],
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
@diffProperty('pattern', patternDiff)
export class TextInputBase<P extends TextInputProperties = TextInputProperties> extends ThemedBase<P, null> {

	private _onBlur (event: FocusEvent) {
		if (this.properties.onBlur) {
			const target = event.target as HTMLInputElement;
			this.properties.onBlur(target.value);
		}
	}

	private _onChange (event: Event) {
		event.stopPropagation();
		if (this.properties.onChange) {
			const target = event.target as HTMLInputElement;
			this.properties.onChange(target.value);
		}
	}

	private _onClick (event: MouseEvent) {
		event.stopPropagation();
		if (this.properties.onClick) {
			const target = event.target as HTMLInputElement;
			this.properties.onClick(target.value);
		}
	}

	private _onFocus (event: FocusEvent) {
		if (this.properties.onFocus) {
			const target = event.target as HTMLInputElement;
			this.properties.onFocus(target.value);
		}
	}

	private _onInput (event: Event) {
		event.stopPropagation();
		if (this.properties.onInput) {
			const target = event.target as HTMLInputElement;
			this.properties.onInput(target.value);
		}
	}

	private _onKeyDown (event: KeyboardEvent) {
		event.stopPropagation();
		if (this.properties.onKeyDown) {
			this.properties.onKeyDown(event.which, () => { event.preventDefault(); });
		}
	}

	private _onKeyPress (event: KeyboardEvent) {
		event.stopPropagation();
		if (this.properties.onKeyPress) {
			this.properties.onKeyPress(event.which, () => { event.preventDefault(); });
		}
	}

	private _onKeyUp (event: KeyboardEvent) {
		event.stopPropagation();
		if (this.properties.onKeyUp) {
			this.properties.onKeyUp(event.which, () => { event.preventDefault(); });
		}
	}

	private _uuid = uuid();

	protected render(): DNode {
		const {
			classes,
			disabled = false,
			widgetId = this._uuid,
			invalid = false,
			label,
			labelAfter = false,
			labelHidden = false,
			readOnly = false,
			required = false,
			theme,
			aria = {},
			maxLength,
			minLength,
			name,
			placeholder,
			type = 'text',
			value,
			pattern,
			autocomplete,
			leading,
			trailing
		} = this.properties;

		const focus = this.meta(Focus).get('root');

		const rootClasses =  this.theme([
			css.root,
			disabled ? css.disabled : null,
			focus.containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null
		]);

		const inputClasses = this.theme(css.input);

		const inputWrapperClasses = this.theme(css.inputWrapper);

		const leadingClasses = this.theme(css.leading);

		const trailingClasses = this.theme(css.trailing);

		const extraLabelClasses = value ? { root: `${this.theme(css.label)} ${this.theme(css.hasValue)}` } : { root: this.theme(css.label)! };

		return v('div', {
			key: 'root',
			classes: rootClasses
		}, [
			label ? w(Label, {
				theme,
				classes,
				extraClasses: extraLabelClasses,
				disabled,
				focused: focus.containsFocus,
				invalid,
				readOnly,
				required,
				hidden: labelHidden,
				forId: widgetId
			}, [ label ]) : null,
			v('div', { classes: inputWrapperClasses }, [
				leading ? v('span', { classes: leadingClasses }, [ leading ]) : null,
				v('input', {
					id: widgetId,
					key: 'input',
					name,
					classes: inputClasses,
					autocomplete: formatAutocomplete(autocomplete),
					disabled,
					focus: this.shouldFocus,
					maxlength: maxLength ? `${maxLength}` : null,
					minlength: minLength ? `${minLength}` : null,
					pattern,
					placeholder,
					readOnly,
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
					...formatAriaProperties(aria),
					'aria-invalid': invalid ? 'true' : null,
					'aria-readonly': readOnly ? 'true' : null
				}),
				trailing ? v('span', { classes: trailingClasses }, [ trailing ]) : null
			])
		]);
	}
}

export default class TextInput extends TextInputBase<TextInputProperties> {}
