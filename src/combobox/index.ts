import { diffProperty } from '@dojo/framework/widget-core/decorators/diffProperty';
import { DNode } from '@dojo/framework/widget-core/interfaces';
import { Keys } from '../common/util';
import { reference } from '@dojo/framework/widget-core/diff';
import { I18nMixin } from '@dojo/framework/widget-core/mixins/I18n';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/widget-core/mixins/Themed';
import Focus from '@dojo/framework/widget-core/meta/Focus';
import { FocusMixin, FocusProperties } from '@dojo/framework/widget-core/mixins/Focus';
import { WidgetBase } from '@dojo/framework/widget-core/WidgetBase';
import { uuid } from '@dojo/framework/core/util';
import { v, w } from '@dojo/framework/widget-core/d';

import Icon from '../icon/index';
import Label from '../label/index';
import Listbox from '../listbox/index';
import TextInput, { TextInputProperties } from '../text-input/index';
import commonBundle from '../common/nls/common';
import { CommonMessages, LabeledProperties } from '../common/interfaces';

import * as css from '../theme/combobox.m.css';
import * as baseCss from '../common/styles/base.m.css';
import { customElement } from '@dojo/framework/widget-core/decorators/customElement';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property clearable          Determines whether the input should be able to be cleared
 * @property disabled           Prevents user interaction and styles content accordingly
 * @property getResultLabel     Can be used to get the text label of a result based on the underlying result object
 * @property getResultSelected  Can be used to highlight the selected result. Defaults to checking the result label
 * @property getResultValue     Can be used to define a value returned by onChange when a given result is selected. Defaults to getResultLabel
 * @property widgetId           Optional id string for the combobox, set on the text input
 * @property inputProperties    TextInput properties to set on the underlying input
 * @property invalid            Determines if this input is valid
 * @property isResultDisabled   Used to determine if an item should be disabled
 * @property label              Label to show for this input
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onMenuChange       Called when menu visibility changes
 * @property onRequestResults   Called when results are shown; should be used to set `results`
 * @property onResultSelect     Called when result is selected
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property readOnly           Prevents user interaction
 * @property required           Determines if this input is required, styles accordingly
 * @property results            Results for the current search term; should be set in response to `onRequestResults`
 * @property value              Value to set on the input
 */
export interface ComboBoxProperties extends ThemedProperties, LabeledProperties, FocusProperties {
	clearable?: boolean;
	disabled?: boolean;
	getResultLabel?(result: any): DNode;
	getResultSelected?(result: any): boolean;
	getResultValue?(result: any): string;
	widgetId?: string;
	inputProperties?: TextInputProperties;
	invalid?: boolean;
	isResultDisabled?(result: any): boolean;
	onBlur?(value: string, key?: string | number): void;
	onChange?(value: string, key?: string | number): void;
	onFocus?(value: string, key?: string | number): void;
	onMenuChange?(open: boolean, key?: string | number): void;
	onRequestResults?(key?: string | number): void;
	onResultSelect?(result: any, key?: string | number): void;
	openOnFocus?: boolean;
	readOnly?: boolean;
	required?: boolean;
	results?: any[];
	value?: string;
}

// Enum used when traversing items using arrow keys
export enum Operation {
	increase = 1,
	decrease = -1
}

@theme(css)
@diffProperty('results', reference)
@customElement<ComboBoxProperties>({
	tag: 'dojo-combo-box',
	properties: [
		'theme',
		'classes',
		'extraClasses',
		'labelAfter',
		'labelHidden',
		'clearable',
		'disabled',
		'inputProperties',
		'invalid',
		'isResultDisabled',
		'labelAfter',
		'labelHidden',
		'openOnFocus',
		'readOnly',
		'required',
		'results'
	],
	attributes: ['widgetId', 'label', 'value'],
	events: ['onBlur', 'onChange', 'onFocus', 'onMenuChange', 'onRequestResults', 'onResultSelect']
})
export class ComboBox extends I18nMixin(ThemedMixin(FocusMixin(WidgetBase)))<ComboBoxProperties> {
	private _activeIndex = 0;
	private _ignoreBlur: boolean | undefined;
	private _idBase = uuid();
	private _menuHasVisualFocus = false;
	private _open: boolean | undefined;
	private _wasOpen: boolean | undefined;

	private _closeMenu() {
		this._open = false;
		this.invalidate();
	}

	private _getMenuId() {
		return `${this._idBase}-menu`;
	}

	private _getResultLabel(result: any) {
		const { getResultLabel } = this.properties;

		return getResultLabel ? getResultLabel(result) : `${result}`;
	}

	private _getResultSelected(result: any) {
		const { getResultSelected, value } = this.properties;

		return getResultSelected
			? getResultSelected(result)
			: this._getResultLabel(result) === value;
	}

	private _getResultValue(result: any) {
		const { getResultValue = this.properties.getResultLabel } = this.properties;

		return getResultValue ? `${getResultValue(result)}` : `${result}`;
	}

	private _getResultId(result: any, index: number) {
		return `${this._idBase}-result${index}`;
	}

	private _onArrowClick(event: MouseEvent) {
		event.stopPropagation();
		const { disabled, readOnly } = this.properties;

		if (!disabled && !readOnly) {
			this.focus();
			this._openMenu();
		}
	}

	private _onClearClick(event: MouseEvent) {
		event.stopPropagation();
		const { key, onChange } = this.properties;

		this.focus();
		this.invalidate();
		onChange && onChange('', key);
	}

	private _onInput(value: string) {
		const { key, disabled, readOnly, onChange } = this.properties;

		onChange && onChange(value, key);
		!disabled && !readOnly && this._openMenu();
	}

	private _onInputBlur(value: string) {
		const { key, onBlur } = this.properties;

		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		onBlur && onBlur(value, key);
		this._closeMenu();
	}

	private _onInputFocus(value: string) {
		const { key, disabled, readOnly, onFocus, openOnFocus } = this.properties;

		onFocus && onFocus(value, key);
		!disabled && !readOnly && openOnFocus && this._openMenu();
	}

	private _onInputKeyDown(key: number, preventDefault: () => void) {
		const {
			disabled,
			isResultDisabled = () => false,
			readOnly,
			results = []
		} = this.properties;
		this._menuHasVisualFocus = true;

		switch (key) {
			case Keys.Up:
				preventDefault();
				this._moveActiveIndex(Operation.decrease);
				break;
			case Keys.Down:
				preventDefault();
				if (!this._open && !disabled && !readOnly) {
					this._openMenu();
				} else if (this._open) {
					this._moveActiveIndex(Operation.increase);
				}
				break;
			case Keys.Escape:
				this._open && this._closeMenu();
				break;
			case Keys.Enter:
			case Keys.Space:
				if (this._open && results.length > 0) {
					if (isResultDisabled(results[this._activeIndex])) {
						return;
					}
					this._selectIndex(this._activeIndex);
				}
				break;
			case Keys.Home:
				this._activeIndex = 0;
				this.invalidate();
				break;
			case Keys.End:
				this._activeIndex = results.length - 1;
				this.invalidate();
				break;
		}
	}

	private _onMenuChange() {
		const { key, onMenuChange } = this.properties;

		if (!onMenuChange) {
			return;
		}

		this._open && !this._wasOpen && onMenuChange(true, key);
		!this._open && this._wasOpen && onMenuChange(false, key);
	}

	private _onResultHover(): void {
		this._menuHasVisualFocus = false;
		this.invalidate();
	}

	private _onResultMouseDown(event: MouseEvent) {
		event.stopPropagation();
		// Maintain underlying input focus on next render
		this._ignoreBlur = true;
	}

	private _openMenu() {
		const { key, onRequestResults } = this.properties;

		this._activeIndex = 0;
		this._open = true;
		onRequestResults && onRequestResults(key);
		this.invalidate();
	}

	private _selectIndex(index: number) {
		const { key, onChange, onResultSelect, results = [] } = this.properties;

		this.focus();
		this._closeMenu();
		onResultSelect && onResultSelect(results[index], key);
		onChange && onChange(this._getResultValue(results[index]), key);
	}

	private _moveActiveIndex(operation: Operation) {
		const { results = [] } = this.properties;

		if (results.length === 0) {
			this._activeIndex = 0;
			this.invalidate();
			return;
		}

		const total = results.length;
		const nextIndex = (this._activeIndex + operation + total) % total;

		this._activeIndex = nextIndex;
		this.invalidate();
	}

	protected getRootClasses(): (string | null)[] {
		const { clearable, invalid } = this.properties;
		const focus = this.meta(Focus).get('root');

		return [
			css.root,
			this._open ? css.open : null,
			clearable ? css.clearable : null,
			focus.containsFocus ? css.focused : null,
			invalid === true ? css.invalid : null,
			invalid === false ? css.valid : null
		];
	}

	protected renderInput(results: any[]): DNode {
		const {
			classes,
			disabled,
			widgetId = this._idBase,
			inputProperties = {},
			invalid,
			readOnly,
			required,
			value = '',
			theme
		} = this.properties;

		return w(TextInput, {
			...inputProperties,
			key: 'textinput',
			classes,
			aria: {
				activedescendant: this._open
					? this._getResultId(results[this._activeIndex], this._activeIndex)
					: null,
				autocomplete: 'list'
			},
			valid: typeof invalid === 'boolean' ? !invalid : undefined,
			disabled,
			widgetId,
			focus: this.shouldFocus,
			onBlur: this._onInputBlur,
			onFocus: this._onInputFocus,
			onInput: this._onInput,
			onKeyDown: this._onInputKeyDown,
			readOnly,
			required,
			theme,
			value
		});
	}

	protected renderClearButton(messages: CommonMessages): DNode {
		const { disabled, label = '', readOnly, theme, classes } = this.properties;

		return v(
			'button',
			{
				key: 'clear',
				'aria-hidden': 'true',
				classes: this.theme(css.clear),
				disabled: disabled || readOnly,
				tabIndex: -1,
				type: 'button',
				onclick: this._onClearClick
			},
			[
				v('span', { classes: baseCss.visuallyHidden }, [`${messages.clear} ${label}`]),
				w(Icon, { type: 'closeIcon', theme, classes })
			]
		);
	}

	protected renderMenuButton(messages: CommonMessages): DNode {
		const { disabled, label = '', readOnly, theme, classes } = this.properties;

		return v(
			'button',
			{
				key: 'trigger',
				'aria-hidden': 'true',
				classes: this.theme(css.trigger),
				disabled: disabled || readOnly,
				tabIndex: -1,
				type: 'button',
				onclick: this._onArrowClick
			},
			[
				v('span', { classes: baseCss.visuallyHidden }, [`${messages.open} ${label}`]),
				w(Icon, { type: 'downIcon', theme, classes })
			]
		);
	}

	protected renderMenu(results: any[]): DNode {
		const { theme, isResultDisabled, classes } = this.properties;

		if (results.length === 0 || !this._open) {
			return null;
		}

		return v(
			'div',
			{
				key: 'dropdown',
				classes: this.theme(css.dropdown),
				onmouseover: this._onResultHover,
				onmousedown: this._onResultMouseDown
			},
			[
				w(Listbox, {
					key: 'listbox',
					classes,
					activeIndex: this._activeIndex,
					widgetId: this._getMenuId(),
					visualFocus: this._menuHasVisualFocus,
					optionData: results,
					tabIndex: -1,
					getOptionDisabled: isResultDisabled,
					getOptionId: this._getResultId,
					getOptionLabel: this._getResultLabel,
					getOptionSelected: this._getResultSelected,
					onActiveIndexChange: (index: number) => {
						this._activeIndex = index;
						this.invalidate();
					},
					onOptionSelect: (option: any, index: number) => {
						this._selectIndex(index);
					},
					theme
				})
			]
		);
	}

	render(): DNode {
		const {
			clearable = false,
			widgetId = this._idBase,
			invalid,
			label,
			readOnly,
			required,
			disabled,
			labelHidden,
			labelAfter,
			results = [],
			theme,
			classes
		} = this.properties;
		const { messages } = this.localizeBundle(commonBundle);
		const focus = this.meta(Focus).get('root');

		const menu = this.renderMenu(results);
		this._onMenuChange();
		this._wasOpen = this._open;

		const controls = [
			label
				? w(
						Label,
						{
							key: 'label',
							theme,
							classes,
							disabled,
							focused: focus.containsFocus,
							invalid,
							readOnly,
							required,
							hidden: labelHidden,
							forId: widgetId
						},
						[label]
				  )
				: null,
			v(
				'div',
				{
					'aria-expanded': this._open ? 'true' : 'false',
					'aria-haspopup': 'listbox',
					'aria-owns': this._open ? this._getMenuId() : null,
					classes: this.theme(css.controls),
					role: 'combobox'
				},
				[
					this.renderInput(results),
					clearable ? this.renderClearButton(messages) : null,
					this.renderMenuButton(messages)
				]
			),
			menu
		];

		return v(
			'div',
			{
				classes: this.theme(this.getRootClasses()),
				key: 'root'
			},
			labelAfter ? controls.reverse() : controls
		);
	}
}

export default ComboBox;
