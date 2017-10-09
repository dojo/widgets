import uuid from '@dojo/core/uuid';
import { v, w } from '@dojo/widget-core/d';
import { Constructor, DNode, WNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { reference } from '@dojo/widget-core/diff';
// import ResultItem from './ResultItem';
// import ResultMenu from './ResultMenu';
import ListBox from '../listbox/Listbox';
import { Keys } from '../common/util';
import Label, { LabelOptions } from '../label/Label';
import TextInput, { TextInputProperties } from '../textinput/TextInput';

import * as css from './styles/comboBox.m.css';
import * as iconCss from '../common/styles/icons.m.css';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property autoBlur           Determines whether the input should blur after value selection
 * @property clearable          Determines whether the input should be able to be cleared
 * @property CustomResultItem   Can be used to render a custom result
 * @property CustomResultMenu   Can be used to render a custom result menu
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
	autoBlur?: boolean;
	clearable?: boolean;
	// CustomResultItem?: Constructor<ResultItem>;
	// CustomResultMenu?: Constructor<ResultMenu>;
	disabled?: boolean;
	getResultLabel?(result: any): string;
	id?: string;
	inputProperties?: TextInputProperties;
	invalid?: boolean;
	isResultDisabled?(result: any): boolean;
	label?: string | LabelOptions;
	onBlur?(value: string): void;
	onChange?(value: string, key: string): void;
	onFocus?(value: string): void;
	onMenuChange?(open: boolean): void;
	onRequestResults?(key: string): void;
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
	private _menuHasFocus = false;
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

		return getResultLabel ? getResultLabel(result) : result;
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
		const { key = '', onChange } = this.properties;

		this._callInputFocus = true;
		this.invalidate();
		onChange && onChange('', key);
	}

	private _onInput(event: Event) {
		const { key = '', onChange } = this.properties;

		onChange && onChange((<HTMLInputElement> event.target).value, key);
		this._openMenu();
	}

	private _onInputBlur(event: FocusEvent) {
		const { onBlur } = this.properties;

		if (this._ignoreBlur) {
			this._ignoreBlur = false;
			return;
		}

		onBlur && onBlur((<HTMLInputElement> event.target).value);
		this._closeMenu();
	}

	private _onInputFocus(event: FocusEvent) {
		const {
			onFocus,
			openOnFocus
		} = this.properties;

		onFocus && onFocus((<HTMLInputElement> event.target).value);
		openOnFocus && this._openMenu();
	}

	private _onInputKeyDown(event: KeyboardEvent) {
		const { results = [] } = this.properties;
		this._menuHasFocus = true;

		switch (event.which) {
			case Keys.Up:
				event.preventDefault();
				this._moveActiveIndex(Operation.decrease);
				break;
			case Keys.Down:
				event.preventDefault();
				this._open ? this._moveActiveIndex(Operation.increase) : this._openMenu();
				break;
			case Keys.Escape:
				this._open && this._closeMenu();
				break;
			case Keys.Enter:
				if (this._open && results.length > 0) {
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
		const { onMenuChange } = this.properties;

		if (!onMenuChange) {
			return;
		}

		this._open && !this._wasOpen && onMenuChange(true);
		!this._open && this._wasOpen && onMenuChange(false);
	}

	private _onResultHover(): void {
		this._menuHasFocus = false;
		this.invalidate();
	}

	private _onResultMouseDown() {
		// Maintain underlying input focus on next render
		this._ignoreBlur = true;
	}

	private _openMenu() {
		const {
			value = '',
			key = '',
			onRequestResults } = this.properties;

		this._activeIndex = 0;
		this._open = true;
		onRequestResults && onRequestResults(key);
	}

	private _scrollIntoView(element: HTMLElement) {
		const menu = <HTMLElement> element.parentElement;
		// Scroll menu up so top of highlighted result aligns with top of menu container
		if (element.offsetTop - menu.scrollTop < 0) {
			menu.scrollTop = element.offsetTop;
		}
		// Scroll menu down so bottom of highlighted result aligns with bottom of menu container
		else if ((element.offsetTop - menu.scrollTop + element.offsetHeight) > menu.clientHeight) {
			menu.scrollTop = element.offsetTop - menu.clientHeight + element.offsetHeight;
		}
	}

	private _selectIndex(index: number) {
		const {
			key = '',
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

		function nextIndex(i?: number) {
			const total = results.length;
			const base = operation === Operation.increase ? 0 : -1;
			const current = i !== undefined ? i + operation : base;
			return (current + total) % total;
		}

		this._activeIndex = nextIndex(this._activeIndex);
		this.invalidate();
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root' && this._callInputFocus) {
			this._callInputFocus = false;
			(element.querySelector('input') as HTMLElement).focus();
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
			theme = {}
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
		const { theme = {}, isResultDisabled } = this.properties;

		if (results.length === 0 || !this._open) {
			return null;
		}

		return v('div', {
			key: 'dropdown',
			classes: this.classes(css.dropdown),
			onmouseover: this._onResultHover,
			onmousedown: this._onResultMouseDown
		}, [
			w(ListBox, {
				activeIndex: this._activeIndex,
				id: this._getMenuId(),
				focused: this._menuHasFocus,
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
			theme = {}
		} = this.properties;

		const menu = this.renderMenu(results);
		this._onMenuChange();
		this._wasOpen = this._open;

		let controls: DNode = v('div', {
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
