import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { diffProperty } from '@dojo/framework/core/decorators/diffProperty';
import { reference } from '@dojo/framework/core/diff';
import { DNode } from '@dojo/framework/core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { FocusMixin, FocusProperties } from '@dojo/framework/core/mixins/Focus';
import Focus from '@dojo/framework/core/meta/Focus';
import { v, w } from '@dojo/framework/core/vdom';
import { uuid } from '@dojo/framework/core/util';
import { find } from '@dojo/framework/shim/array';
import { formatAriaProperties, Keys } from '../common/util';
import Icon from '../icon/index';
import Label from '../label/index';
import Listbox from '../listbox/index';
import HelperText from '../helper-text/index';
import * as css from '../theme/select.m.css';

/**
 * @type SelectProperties
 *
 * Properties that can be set on a Select component
 *
 * @property getOptionDisabled Function that accepts an option's data and index and returns a boolean
 * @property getOptionId       Function that accepts an option's data and index and returns a string id
 * @property getOptionLabel    Function that accepts an option's data and returns a DNode label
 * @property getOptionText     Function that accepts an option's data and returns a string, used for matching an option on keydown
 * @property getOptionSelected Function that accepts an option's data and index and returns a boolean
 * @property getOptionValue    Function that accepts an option's data and index and returns a string value
 * @property options           Array of any type of data for the options
 * @property placeholder       Optional placeholder text, only valid for custom select widgets (useNativeElement must be false or undefined)
 * @property useNativeElement  Use the native <select> element if true
 * @property value           The current value
 */
export interface SelectProperties<T = any> extends ThemedProperties, FocusProperties {
	aria?: { [key: string]: string | null };
	disabled?: boolean;
	widgetId?: string;
	name?: string;
	readOnly?: boolean;
	required?: boolean;
	getOptionDisabled?(option: T, index: number): boolean;
	getOptionId?(option: T, index: number): string;
	getOptionLabel?(option: T): DNode;
	getOptionText?(option: T): string;
	getOptionSelected?(option: T, index: number): boolean;
	getOptionValue?(option: T, index: number): string;
	helperText?: string;
	options?: T[];
	placeholder?: string;
	useNativeElement?: boolean;
	onBlur?(): void;
	onChange?(option: T): void;
	onFocus?(): void;
	value?: string;
	labelHidden?: boolean;
	label?: string;
	valid?: boolean;
}

@theme(css)
@diffProperty('options', reference)
export class Select<T = any> extends ThemedMixin(FocusMixin(WidgetBase))<SelectProperties<T>> {
	private _focusedIndex!: number;
	private _focusNode = 'trigger';
	private _ignoreBlur = false;
	private _open = false;
	private _baseId = uuid();
	private _inputText = '';
	private _resetInputTextTimer: any;

	private _getOptionLabel(option: T) {
		const { getOptionLabel } = this.properties;
		const fallback = option ? `${option}` : '';
		return getOptionLabel ? getOptionLabel(option) : fallback;
	}

	private _getOptionSelected = (option: T, index: number) => {
		const { getOptionValue, value } = this.properties;
		if (getOptionValue) {
			return getOptionValue(option, index) === value;
		} else if (typeof option === 'string') {
			return option === value;
		}
		return false;
	};

	private _getSelectedIndexOnInput(event: KeyboardEvent) {
		const { options = [], getOptionDisabled, getOptionText } = this.properties;
		if (event.key !== undefined && event.key.length === 1) {
			clearTimeout(this._resetInputTextTimer);
			this._resetInputTextTimer = setTimeout(() => {
				this._inputText = '';
			}, 800);
			this._inputText += `${event.key}`;
			let index;
			options.some((option, i) => {
				if (getOptionDisabled && getOptionDisabled(option, i)) {
					return false;
				}
				const optionText = getOptionText
					? getOptionText(option)
					: this._getOptionLabel(option);
				if (
					typeof optionText === 'string' &&
					optionText.toLowerCase().indexOf(this._inputText.toLowerCase()) === 0
				) {
					index = i;
					return true;
				}
				return false;
			});
			return index;
		}
	}

	private _onBlur() {
		this.properties.onBlur && this.properties.onBlur();
	}
	private _onFocus() {
		this.properties.onFocus && this.properties.onFocus();
	}

	// native select events
	private _onNativeChange(event: Event) {
		const { getOptionValue, options = [], onChange } = this.properties;
		event.stopPropagation();
		const value = (<HTMLInputElement>event.target).value;
		const option = find(options, (option: T, index: number) => {
			if (getOptionValue) {
				return getOptionValue(option, index) === value;
			} else if (typeof option === 'string') {
				return option === value;
			}
			return false;
		});
		option && onChange && onChange(option);
	}

	// custom select events
	private _openSelect() {
		this.focus();
		this._focusNode = 'listbox';
		this._ignoreBlur = true;
		this._open = true;
		this._focusedIndex = this._focusedIndex || 0;
		this.invalidate();
	}

	private _closeSelect() {
		this._focusNode = 'trigger';
		this._ignoreBlur = true;
		this._open = false;
		this.invalidate();
	}

	private _onDropdownKeyDown(event: KeyboardEvent) {
		event.stopPropagation();
		if (event.which === Keys.Escape) {
			this._closeSelect();
			this.focus();
		}
	}

	private _onTriggerClick(event: MouseEvent) {
		event.stopPropagation();
		this._open ? this._closeSelect() : this._openSelect();
	}

	private _onTriggerBlur(event: FocusEvent) {
		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		const { onBlur } = this.properties;
		onBlur && onBlur();
		this._closeSelect();
	}

	private _onTriggerKeyDown(event: KeyboardEvent) {
		const { options = [], onChange } = this.properties;
		event.stopPropagation();
		const index = this._getSelectedIndexOnInput(event);
		if (index !== undefined) {
			this._focusedIndex = index;
			onChange && onChange(options[index]);
			this.invalidate();
		}
		if (event.which === Keys.Down) {
			this._openSelect();
		}
	}

	private _onTriggerMouseDown() {
		this._ignoreBlur = true;
	}

	private _onListboxBlur(event: FocusEvent) {
		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		const { onBlur } = this.properties;
		onBlur && onBlur();
		this._closeSelect();
	}

	protected renderExpandIcon(): DNode {
		const { theme, classes } = this.properties;
		return v('span', { classes: this.theme(css.arrow) }, [
			w(Icon, { type: 'downIcon', theme, classes })
		]);
	}

	protected renderNativeSelect(): DNode {
		const {
			aria = {},
			disabled,
			getOptionDisabled,
			getOptionId,
			getOptionSelected,
			getOptionValue,
			widgetId = this._baseId,
			valid,
			name,
			options = [],
			readOnly,
			required,
			value
		} = this.properties;

		/* create option nodes */
		const optionNodes = options.map((option, i) =>
			v(
				'option',
				{
					value: getOptionValue ? getOptionValue(option, i) : undefined,
					id: getOptionId ? getOptionId(option, i) : undefined,
					disabled: getOptionDisabled ? getOptionDisabled(option, i) : undefined,
					selected: getOptionSelected ? getOptionSelected(option, i) : undefined
				},
				[this._getOptionLabel(option)]
			)
		);

		return v('div', { classes: this.theme(css.inputWrapper) }, [
			v(
				'select',
				{
					...formatAriaProperties(aria),
					classes: this.theme(css.input),
					disabled,
					focus: this.shouldFocus,
					'aria-invalid': valid === false ? 'true' : null,
					id: widgetId,
					name,
					readOnly,
					'aria-readonly': readOnly ? 'true' : null,
					required,
					value,
					onblur: this._onBlur,
					onchange: this._onNativeChange,
					onfocus: this._onFocus
				},
				optionNodes
			),
			this.renderExpandIcon()
		]);
	}

	protected renderCustomSelect(): DNode {
		const {
			getOptionDisabled,
			getOptionId,
			getOptionLabel,
			getOptionSelected = this._getOptionSelected,
			widgetId = this._baseId,
			options = [],
			theme,
			classes,
			onChange
		} = this.properties;

		if (this._focusedIndex === undefined) {
			options.map(getOptionSelected).forEach((isSelected, index) => {
				if (isSelected) {
					this._focusedIndex = index;
				}
			});
		}

		const { _open, _focusedIndex = 0 } = this;
		// create dropdown trigger and select box
		return v(
			'div',
			{
				key: 'wrapper',
				classes: this.theme([css.inputWrapper, _open ? css.open : null])
			},
			[
				...this.renderCustomTrigger(),
				v(
					'div',
					{
						classes: this.theme(css.dropdown),
						onfocusout: this._onListboxBlur,
						onkeydown: this._onDropdownKeyDown
					},
					[
						w(Listbox, {
							key: 'listbox',
							activeIndex: _focusedIndex,
							widgetId: widgetId,
							focus: this._focusNode === 'listbox' ? this.shouldFocus : () => false,
							optionData: options,
							tabIndex: _open ? 0 : -1,
							getOptionDisabled,
							getOptionId,
							getOptionLabel,
							getOptionSelected,
							theme,
							classes,
							onActiveIndexChange: (index: number) => {
								this._focusedIndex = index;
								this.invalidate();
							},
							onOptionSelect: (option: T) => {
								onChange && onChange(option);
								this._closeSelect();
								this.focus();
							},
							onKeyDown: (event: KeyboardEvent) => {
								const index = this._getSelectedIndexOnInput(event);
								if (index !== undefined) {
									this._focusedIndex = index;
									this.invalidate();
								}
							}
						})
					]
				)
			]
		);
	}

	protected renderCustomTrigger(): DNode[] {
		const {
			aria = {},
			disabled,
			getOptionSelected = this._getOptionSelected,
			valid,
			options = [],
			placeholder,
			readOnly,
			required,
			value
		} = this.properties;

		let label: DNode;
		let isPlaceholder = false;

		const selectedOption = find(options, (option: T, index: number) => {
			return getOptionSelected(option, index);
		});

		if (selectedOption) {
			label = this._getOptionLabel(selectedOption);
		} else {
			isPlaceholder = true;
			label = placeholder ? placeholder : this._getOptionLabel(options[0]);
		}

		return [
			v(
				'button',
				{
					...formatAriaProperties(aria),
					'aria-controls': this._baseId,
					'aria-expanded': `${this._open}`,
					'aria-haspopup': 'listbox',
					'aria-invalid': valid === false ? 'true' : null,
					'aria-required': required ? 'true' : null,
					classes: this.theme([css.trigger, isPlaceholder ? css.placeholder : null]),
					disabled: disabled || readOnly,
					focus: this._focusNode === 'trigger' ? this.shouldFocus : () => false,
					key: 'trigger',
					type: 'button',
					value,
					onblur: this._onTriggerBlur,
					onclick: this._onTriggerClick,
					onfocus: this._onFocus,
					onkeydown: this._onTriggerKeyDown,
					onmousedown: this._onTriggerMouseDown
				},
				[label]
			),
			this.renderExpandIcon()
		];
	}

	protected render(): DNode {
		const {
			label,
			labelHidden,
			disabled,
			helperText,
			widgetId = this._baseId,
			valid,
			readOnly,
			required,
			useNativeElement = false,
			theme,
			classes
		} = this.properties;

		const focus = this.meta(Focus).get('root');

		return v(
			'div',
			{
				key: 'root',
				classes: this.theme([
					css.root,
					disabled ? css.disabled : null,
					focus.containsFocus ? css.focused : null,
					valid === false ? css.invalid : null,
					valid === true ? css.valid : null,
					readOnly ? css.readonly : null,
					required ? css.required : null
				])
			},
			[
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
								forId: widgetId
							},
							[label]
					  )
					: null,
				useNativeElement ? this.renderNativeSelect() : this.renderCustomSelect(),
				w(HelperText, { theme, text: helperText })
			]
		);
	}
}

export default Select;
