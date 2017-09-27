import uuid from '@dojo/core/uuid';
import { v, w } from '@dojo/widget-core/d';
import { Constructor, DNode, WNode } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { diffProperty } from '@dojo/widget-core/decorators/diffProperty';
import { reference } from '@dojo/widget-core/diff';
import ResultItem from './ResultItem';
import ResultMenu from './ResultMenu';
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
	CustomResultItem?: Constructor<ResultItem>;
	CustomResultMenu?: Constructor<ResultMenu>;
	disabled?: boolean;
	getResultLabel?(result: any): string;
	inputProperties?: TextInputProperties;
	invalid?: boolean;
	isResultDisabled?(result: any): boolean;
	label?: string | LabelOptions;
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onMenuChange?(open: boolean): void;
	onRequestResults?(value: string): void;
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
	private _activeIndex: number | undefined;
	private _focused: boolean;
	private _ignoreBlur: boolean;
	private _ignoreFocus: boolean;
	private _inputElement: HTMLInputElement;
	private _menuId = uuid();
	private _open: boolean;
	private _wasOpen: boolean;

	private _closeMenu() {
		this._open = false;
		this.invalidate();
	}

	private _getResultLabel(result: any) {
		const { getResultLabel } = this.properties;

		return getResultLabel ? getResultLabel(result) : result;
	}

	private _isIndexDisabled(index: number) {
		const {
			isResultDisabled,
			results = []
		} = this.properties;

		return isResultDisabled && isResultDisabled(results[index]);
	}

	private _onArrowClick() {
		const {
			disabled,
			readOnly
		} = this.properties;

		!disabled && !readOnly && this._openMenu();
	}

	private _onClearClick() {
		const { onChange } = this.properties;

		this._focused = true;
		this.invalidate();
		onChange && onChange('');
	}

	private _onInput(event: Event) {
		const { onChange } = this.properties;

		this._activeIndex = undefined;
		onChange && onChange((<HTMLInputElement> event.target).value);
		this._openMenu();
	}

	private _onInputBlur(event: FocusEvent) {
		const { onBlur } = this.properties;

		if (this._ignoreBlur) {
			return;
		}

		this._focused = false;
		onBlur && onBlur((<HTMLInputElement> event.target).value);
		this._closeMenu();
	}

	private _onInputFocus(event: FocusEvent) {
		const {
			onFocus,
			openOnFocus
		} = this.properties;

		this._focused = true;
		onFocus && onFocus((<HTMLInputElement> event.target).value);
		openOnFocus && !this._ignoreFocus && this._openMenu();
		this._ignoreBlur = false;
		this._ignoreFocus = false;
	}

	private _onInputKeyDown(event: KeyboardEvent) {
		const { results = [] } = this.properties;

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
					this._activeIndex === undefined ? this._closeMenu() : this._selectIndex(this._activeIndex);
				}
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

	private _onResultMouseDown() {
		// Maintain underlying input focus on next render
		this._ignoreBlur = true;
	}

	private _onResultMouseEnter(event: MouseEvent, index: number) {
		if (this._isIndexDisabled(index)) {
			return;
		}

		this._activeIndex = index;
		this.invalidate();
	}

	private _onResultMouseUp(event: MouseEvent, index: number) {
		if (!this._isIndexDisabled(index)) {
			this._ignoreFocus = true;
			this._selectIndex(index);
		}
	}

	private _openMenu() {
		const { onRequestResults } = this.properties;

		this._activeIndex = undefined;
		this._open = true;
		this._focused = true;
		onRequestResults && onRequestResults(this._inputElement.value);
	}

	private _restoreFocus() {
		const func = this._focused ? 'focus' : 'blur';
		this._inputElement[func]();
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
			autoBlur,
			onChange,
			results = []
		} = this.properties;

		this._focused = !autoBlur;
		this._closeMenu();
		onChange && onChange(this._getResultLabel(results[index]));
	}

	private _moveActiveIndex(operation: Operation) {
		const { results = [] } = this.properties;

		if (results.length === 0) {
			this._activeIndex = 0;
			this.invalidate();
			return;
		}
		if (results.every((result, i) => Boolean(this._isIndexDisabled(i)))) {
			return;
		}

		function nextIndex(i?: number) {
			const total = results.length;
			const base = operation === Operation.increase ? 0 : -1;
			const current = i !== undefined ? i + operation : base;
			return (current + total) % total;
		}

		let index = nextIndex(this._activeIndex);

		while (this._isIndexDisabled(index)) {
			index = nextIndex(index);
		}

		this._activeIndex = index;
		this.invalidate();
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'root') {
			this._inputElement = <HTMLInputElement> element.querySelector('input');
			this._restoreFocus();
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root') {
			this._restoreFocus();
			const selectedResult = element.querySelector('[data-selected="true"]');
			selectedResult && this._scrollIntoView(<HTMLElement> selectedResult);
		}
	}

	protected renderMenu(results: any[]): WNode | null {
		const { theme = {}, isResultDisabled, CustomResultMenu = ResultMenu, CustomResultItem } = this.properties;

		if (results.length === 0 || !this._open) {
			return null;
		}

		return w(CustomResultMenu, {
			getResultLabel: this._getResultLabel,
			CustomResultItem,
			id: this._menuId,
			isResultDisabled,
			onResultMouseDown: this._onResultMouseDown,
			onResultMouseEnter: this._onResultMouseEnter,
			onResultMouseUp: this._onResultMouseUp,
			results,
			selectedIndex: this._activeIndex,
			theme
		});
	}

	render(): DNode {
		const {
			clearable,
			disabled,
			inputProperties = {},
			invalid,
			label,
			readOnly,
			required,
			results = [],
			value = '',
			theme = {}
		} = this.properties;

		const menu = this.renderMenu(results);
		const menuId = menu ? this._menuId : '';
		this._onMenuChange();
		this._wasOpen = this._open;

		let controls: DNode = v('div', {
			classes: this.classes(css.controls)
		}, [
			w(TextInput, <TextInputProperties> {
				...inputProperties,
				classes: this.classes(clearable ? css.clearable : null),
				controls: menuId,
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
			}),
			clearable ? v('button', {
				'aria-controls': menuId,
				classes: this.classes(css.clear),
				disabled,
				readOnly,
				onclick: this._onClearClick
			}, [
				'clear combo box',
				v('i', { classes: this.classes(iconCss.icon, iconCss.closeIcon),
					role: 'presentation', 'aria-hidden': 'true'
				})
			]) : null,
			v('button', {
				'aria-controls': menuId,
				classes: this.classes(css.trigger),
				disabled,
				readOnly,
				onclick: this._onArrowClick
			}, [
				'open combo box',
				v('i', { classes: this.classes(iconCss.icon, iconCss.downIcon),
					role: 'presentation', 'aria-hidden': 'true'
				})
			])
		]);

		if (label) {
			controls = w(Label, {
				label
			}, [ controls ]);
		}

		return v('div', {
			'aria-expanded': this._open ? 'true' : 'false',
			'aria-haspopup': 'true',
			'aria-readonly': readOnly ? 'true' : 'false',
			'aria-required': required ? 'true' : 'false',
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
