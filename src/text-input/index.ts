import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { DNode, PropertyChangeRecord } from '@dojo/framework/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import { v, w } from '@dojo/framework/widget-core/d';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import { FocusMixin, FocusProperties } from '@dojo/framework/widget-core/mixins/Focus';
import Label from '../label/index';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { uuid } from '@dojo/framework/core/util';
import * as css from '../theme/text-input.m.css';
import * as fixedCss from './styles/text-input.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';
import diffProperty from '@dojo/framework/widget-core/decorators/diffProperty';

export type TextInputType = 'text' | 'email' | 'number' | 'password' | 'search' | 'tel' | 'url' | 'date';

/**
 * @type TextInputProperties
 *
 * Properties that can be set on a TextInput widget *
 * @property autocomplete
 * @property controls
 * @property disabled
 * @property invalid
 * @property label
 * @property labelHidden
 * @property leading
 * @property maxLength
 * @property minLength
 * @property name
 * @property pattern
 * @property placeholder
 * @property readOnly
 * @property required
 * @property trailing
 * @property type
 * @property value
 * @property widgetId
 *
 * Callbacks from TextInput Widget
 * @property onBlur(): void;
 * @property onClick(): void;
 * @property onFocus(): void;
 * @property onKey(key: number, preventDefault: () => void): void;
 * @property onValue(value: string): void;
 * @property onOver(): void;
 * @property onOut(): void;
 */

export interface TextInputProperties extends CustomAriaProperties, ThemedProperties {
	// properties
	autocomplete?: boolean | string;
	controls?: string;
	disabled?: boolean;
	invalid?: boolean;
	label?: string;
	labelHidden?: boolean;
	labelPosition?: 'before' | 'after' | 'above' | 'below';
	leading?: DNode;
	maxLength?: number | string;
	minLength?: number | string;
	name?: string;
	pattern?: string | RegExp;
	placeholder?: string;
	readOnly?: boolean;
	required?: boolean;
	trailing?: DNode;
	type?: TextInputType;
	value?: string;
	widgetId?: string;

	// callbacks
	onBlur?(): void;
	onClick?(): void;
	onFocus?(): void;
	onKey?(key: number, preventDefault: () => void): void;
	onOut?(): void;
	onOver?(): void;
	onValue?(value: string): void;
}

function formatAutocomplete(autocomplete: boolean | string | undefined): string | undefined {
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
		'aria',
		'classes',
		'disabled',
		'extraClasses',
		'invalid',
		'labelHidden',
		'readOnly',
		'required',
		'theme',
		'leading',
		'trailing'
	],
	attributes: [
		'autocomplete',
		'controls',
		'label',
		'labelPosition',
		'maxLength',
		'minLength',
		'name',
		'pattern',
		'placeholder',
		'type',
		'value',
		'widgetId'
	],
	events: [
		'onBlur',
		'onClick',
		'onFocus',
		'onKey',
		'onOut',
		'onOver',
		'onValue'
	]
})
@diffProperty('pattern', patternDiff)
export class TextInput extends ThemedMixin(FocusMixin(WidgetBase))<TextInputProperties> {

	private _onBlur(event: FocusEvent) {
		this.properties.onBlur && this.properties.onBlur();
	}

	private _onClick(event: MouseEvent) {
		event.stopPropagation();
		this.properties.onClick && this.properties.onClick();
	}

	private _onFocus(event: FocusEvent) {
		this.properties.onFocus && this.properties.onFocus();
	}

	private _onValue(event: Event) {
		event.stopPropagation();
		if (this.properties.onValue) {
			const target = event.target as HTMLInputElement;
			this.properties.onValue(target.value);
		}
	}

	private _onKey(event: KeyboardEvent) {
		event.stopPropagation();
		if (this.properties.onKey) {
			this.properties.onKey
			(event.which, () => { event.preventDefault(); });
		}
	}

	private _onOver(event: PointerEvent) {
		this.properties.onOver && this.properties.onOver();
	}

	private _onOut(event: PointerEvent) {
		this.properties.onOut && this.properties.onOut();
	}

	private _uuid = uuid();

	private _labelPositionClasses = {
		before: fixedCss.labelBeforeFixed,
		after: fixedCss.labelAfterFixed,
		above: fixedCss.labelAboveFixed,
		below: fixedCss.labelBelowFixed
	};

	protected render(): DNode {
		const {
			aria = {},
			autocomplete,
			classes,
			disabled = false,
			invalid,
			label,
			labelHidden = false,
			labelPosition = 'before',
			leading,
			maxLength,
			minLength,
			name,
			pattern,
			placeholder,
			readOnly = false,
			required = false,
			theme,
			trailing,
			type = 'text',
			value,
			widgetId = this._uuid
		} = this.properties;

		const { containsFocus } = this.meta(Focus).get('root');

		const rootClasses =  [
			css.root,
			fixedCss.rootFixed,
			disabled ? css.disabled : null,
			containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null,
			readOnly ? css.readonly : null,
			required ? css.required : null,
			value ? css.hasValue : null,
			leading ? css.hasLeading : null,
			trailing ? css.hasTrailing : null,
			this._labelPositionClasses[labelPosition]
		];

		const extraLabelClasses = { root: `${this.theme(css.label)} ${this.theme(value ? css.labelHasValue : null)}` };

		return v('div', {
			key: 'root',
			classes: this.theme(rootClasses)
		}, [
			label ? w(Label, {
				classes,
				disabled,
				extraClasses: extraLabelClasses,
				focused: containsFocus,
				forId: widgetId,
				hidden: labelHidden,
				invalid,
				readOnly,
				required,
				theme
			}, [ label ]) : null,
			v('div', { key: 'wrapper', classes: this.theme(css.inputWrapper) }, [
				leading ? v('span', { key: 'leading', classes: this.theme(css.icon) }, [ leading ]) : null,
				v('input', {
					'aria-invalid': invalid ? 'true' : null,
					'aria-readonly': readOnly ? 'true' : null,
					autocomplete: formatAutocomplete(autocomplete),
					classes: this.theme(css.input),
					disabled,
					focus: this.shouldFocus,
					id: widgetId,
					key: 'input',
					maxlength: maxLength ? `${maxLength}` : null,
					minlength: minLength ? `${minLength}` : null,
					name,
					onblur: this._onBlur,
					onclick: this._onClick,
					onfocus: this._onFocus,
					oninput: this._onValue,
					onkeydown: this._onKey,
					onpointerover: this._onOver,
					onpointerout: this._onOut,
					pattern,
					placeholder,
					readOnly,
					required,
					type,
					value,
					...formatAriaProperties(aria)
				}),
				trailing ? v('span', { key: 'trailing', classes: this.theme(css.icon) }, [ trailing ]) : null
			])
		]);
	}
}

export default TextInput;
