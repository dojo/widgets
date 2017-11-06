import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import { Keys } from '../common/util';
import { reference } from '@dojo/widget-core/diff';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import uuid from '@dojo/core/uuid';
import { v, w } from '@dojo/widget-core/d';

import Label, { LabelOptions } from '../label/Label';
import Listbox from '../listbox/Listbox';
import TextInput, { TextInputProperties } from '../textinput/TextInput';

import * as css from './styles/comboBox.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property clearable          Determines whether the input should be able to be cleared
 * @property disabled           Prevents user interaction and styles content accordingly
 * @property getResultLabel     Can be used to get the text label of a result based on the underlying result object
 * @property id                 Optional id string for the combobox
 * @property inputProperties    TextInput properties to set on the underlying input
 * @property invalid            Determines if this input is valid
 * @property isResultDisabled   Used to determine if an item should be disabled
 * @property label              Label to show for this input
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onMenuChange       Called when menu visibility changes
 * @property onRequestResults   Called when results are shown; should be used to set `results`
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property readOnly           Prevents user interaction
 * @property required           Determines if this input is required, styles accordingly
 * @property results            Results for the current search term; should be set in response to `onRequestResults`
 * @property value              Value to set on the input
 */
export interface ComboBoxProperties extends ThemeableProperties {
	clearable?: boolean;
	disabled?: boolean;
	getResultLabel?(result: any): string;
	id?: string;
	inputProperties?: TextInputProperties;
	invalid?: boolean;
	isResultDisabled?(result: any): boolean;
	label?: string | LabelOptions;
	onBlur?(value: string, key?: string | number): void;
	onChange?(value: string, key?: string | number): void;
	onFocus?(value: string, key?: string | number): void;
	onMenuChange?(open: boolean, key?: string | number): void;
	onRequestResults?(key?: string | number): void;
	openOnFocus?: boolean;
	readOnly?: boolean;
	required?: boolean;
	results?: any[];
	value?: string;
}

// Enum used when traversing items using arrow keys
export const enum Operation {
	increase = 1,
	decrease = -1
}

export const ComboBoxBase = ThemeableMixin(WidgetBase);

@theme(css)
@theme(iconCss)
@diffProperty('results', reference)
export default class ComboBox extends ComboBoxBase<ComboBoxProperties> {
	private _activeIndex = 0;
	private _callInputFocus = false;
	private _ignoreBlur: boolean;
	private _idBase = uuid();
	private _menuHasVisualFocus = false;
	private _open: boolean;
	private _wasOpen: boolean;

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

	private _getResultId(result: any, index: number) {
		return `${this._idBase}-result${index}`;
	}

	private _onArrowClick() {
		const {
			disabled,
			readOnly
		} = this.properties;

		if (!disabled && !readOnly) {
			this._callInputFocus = true;
			this._openMenu();
		}
	}

	private _onClearClick() {
		const { key, onChange } = this.properties;

		this._callInputFocus = true;
		this.invalidate();
		onChange && onChange('', key);
	}

	private _onInput(event: Event) {
		const { key, onChange } = this.properties;

		onChange && onChange((<HTMLInputElement> event.target).value, key);
		this._openMenu();
	}

	private _onInputBlur(event: FocusEvent) {
		const { key, onBlur } = this.properties;

		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		onBlur && onBlur((<HTMLInputElement> event.target).value, key);
		this._closeMenu();
	}

	private _onInputFocus(event: FocusEvent) {
		const {
			key,
			onFocus,
			openOnFocus
		} = this.properties;

		onFocus && onFocus((<HTMLInputElement> event.target).value, key);
		openOnFocus && this._openMenu();
	}

	private _onInputKeyDown(event: KeyboardEvent) {
		const {
			disabled,
			isResultDisabled = () => false,
			readOnly,
			results = []
		} = this.properties;
		this._menuHasVisualFocus = true;

		switch (event.which) {
			case Keys.Up:
				event.preventDefault();
				this._moveActiveIndex(Operation.decrease);
				break;
			case Keys.Down:
				event.preventDefault();
				if (!this._open && !disabled && !readOnly) {
					this._openMenu();
				}
				else if (this._open) {
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

	private _onResultMouseDown() {
		// Maintain underlying input focus on next render
		this._ignoreBlur = true;
	}

	private _openMenu() {
		const {
			key,
			onRequestResults
		} = this.properties;

		this._activeIndex = 0;
		this._open = true;
		onRequestResults && onRequestResults(key);
		this.invalidate();
	}

	private _selectIndex(index: number) {
		const {
			key,
			onChange,
			results = []
		} = this.properties;

		this._callInputFocus = true;
		this._closeMenu();
		onChange && onChange(this._getResultLabel(results[index]), key);
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

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root') {
			if (this._callInputFocus) {
				this._callInputFocus = false;
				const input = element.querySelector('input') as HTMLElement;
				input && input.focus();
			}
		}
	}

	protected renderInput(): WNode {
		const {
			clearable,
			disabled,
			inputProperties = {},
			invalid,
			readOnly,
			required,
			results = [],
			value = '',
			theme
		} = this.properties;

		return w(TextInput, <TextInputProperties> {
			...inputProperties,
			key: 'textinput',
			'aria-activedescendant': this._getResultId(results[this._activeIndex], this._activeIndex),
			'aria-owns': this._getMenuId(),
			classes: this.classes(clearable ? css.clearable : null),
			controls: this._getMenuId(),
			disabled,
			invalid,
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

	protected renderClearButton() {
		const {
			disabled,
			readOnly
		} = this.properties;

		return v('button', {
			'aria-controls': this._getMenuId(),
			classes: this.classes(css.clear),
			disabled,
			readOnly,
			onclick: this._onClearClick
		}, [
			'clear combo box',
			v('i', { classes: this.classes(iconCss.icon, iconCss.closeIcon),
				role: 'presentation', 'aria-hidden': 'true'
			})
		]);
	}

	protected renderMenuButton() {
		const {
			disabled,
			readOnly
		} = this.properties;

		return v('button', {
			classes: this.classes(css.trigger),
			disabled,
			readOnly,
			tabIndex: -1,
			onclick: this._onArrowClick
		}, [
			'open combo box',
			v('i', {
				'aria-hidden': 'true',
				classes: this.classes(iconCss.icon, iconCss.downIcon),
				role: 'presentation'
			})
		]);
	}

	protected renderMenu(results: any[]): DNode | null {
		const { theme, isResultDisabled } = this.properties;

		if (results.length === 0 || !this._open) {
			return null;
		}

		return v('div', {
			key: 'dropdown',
			classes: this.classes(css.dropdown),
			onmouseover: this._onResultHover,
			onmousedown: this._onResultMouseDown
		}, [
			w(Listbox, {
				activeIndex: this._activeIndex,
				id: this._getMenuId(),
				visualFocus: this._menuHasVisualFocus,
				optionData: results,
				tabIndex: -1,
				getOptionDisabled: isResultDisabled,
				getOptionId: this._getResultId,
				getOptionLabel: this._getResultLabel,
				onActiveIndexChange: (index: number) => {
					this._activeIndex = index;
					this.invalidate();
				},
				onOptionSelect: (option: any, index: number) => {
					this._selectIndex(index);
				},
				theme
			})
		]);
	}

	render(): DNode {
		const {
			clearable,
			id,
			invalid,
			label,
			readOnly,
			required,
			results = [],
			theme
		} = this.properties;

		const menu = this.renderMenu(results);
		this._onMenuChange();
		this._wasOpen = this._open;

		let controls: DNode = v('div', <any> {
			bind: this,
			classes: this.classes(css.controls)
		}, [
			this.renderInput(),
			clearable ? this.renderClearButton() : null,
			this.renderMenuButton()
		]);

		if (label) {
			controls = w(Label, {
				label,
				theme
			}, [ controls ]);
		}

		return v('div', {
			'aria-expanded': this._open ? 'true' : 'false',
			'aria-haspopup': 'true',
			'aria-readonly': readOnly ? 'true' : 'false',
			'aria-required': required ? 'true' : 'false',
			id,
			classes: this.classes(
				css.root,
				this._open ? css.open : null,
				invalid ? css.invalid : null,
				invalid === false ? css.valid : null
			),
			key: 'root',
			role: 'combobox'
		}, [
			controls,
			menu
		]);
	}
}
