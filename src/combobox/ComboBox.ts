import { DNode, WNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import Label, { LabelOptions } from '../label/Label';
import ResultItem from './ResultItem';
import ResultMenu, { ResultMenuProperties } from './ResultMenu';
import TextInput, { TextInputProperties } from '../textinput/TextInput';
import uuid from '@dojo/core/uuid';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { Keys } from '../common/util';

import * as css from './styles/comboBox.m.css';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property autoBlur           Determines whether the input should blur after value selection
 * @property clearable          Determines whether the input should be able to be cleared
 * @property customResultItem   Can be used to render a custom result
 * @property customResultMenu   Can be used to render a custom result menu
 * @property disabled           Prevents user interaction and styles content accordingly
 * @property formId             ID of a form element associated with the form field
 * @property inputProperties    TextInput properties to set on the underlying input
 * @property invalid            Determines if this input is valid
 * @property label              Label to show for this input
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property readOnly           Prevents user interaction
 * @property required           Determines if this input is required, styles accordingly
 * @property results            Results for the current search term; should be set in response to `onRequestResults`
 * @property value              Value to set on the input
 * @property getResultLabel     Can be used to get the text label of a result based on the underlying result object
 * @property isResultDisabled   Used to determine if an item should be disabled
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onMenuChange       Called when menu visibility changes
 * @property onRequestResults   Called when results are shown; should be used to set `results`
 */
export interface ComboBoxProperties extends ThemeableProperties {
	autoBlur?: boolean;
	clearable?: boolean;
	customResultItem?: any;
	customResultMenu?: any;
	disabled?: boolean;
	formId?: string;
	inputProperties?: TextInputProperties;
	invalid?: boolean;
	label?: string | LabelOptions;
	openOnFocus?: boolean;
	readOnly?: boolean;
	required?: boolean;
	results?: any[];
	value?: string;
	getResultLabel?(result: any): string;
	isResultDisabled?(result: any): boolean;
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onMenuChange?(open: boolean): void;
	onRequestResults?(value: string): void;
};

// Enum used when traversing items using arrow keys
export const enum Operation {
	increase = 1,
	decrease = -1
};

export const ComboBoxBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ComboBox extends ComboBoxBase<ComboBoxProperties> {
	private _activeIndex: number | undefined;
	private _focused: boolean;
	private _ignoreBlur: boolean;
	private _ignoreFocus: boolean;
	private _inputElement: HTMLInputElement;
	private _open: boolean;
	private _wasOpen: boolean;
	private _registry: WidgetRegistry;

	private _closeMenu() {
		this._open = false;
		this.invalidate();
	}

	private _createRegistry(customResultItem: any, customResultMenu: any) {
		const registry = new WidgetRegistry();
		registry.define('result-item', customResultItem);
		registry.define('result-menu', customResultMenu);

		return registry;
	}

	private _getResultLabel(result: any) {
		const { getResultLabel } = this.properties;

		return getResultLabel ? getResultLabel(result) : result;
	}

	private _isIndexDisabled(index: number) {
		const {
			results = [],
			isResultDisabled
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
			openOnFocus,
			onFocus
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

	@onPropertiesChanged()
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, ComboBoxProperties>) {
		const {
			customResultItem = ResultItem,
			customResultMenu = ResultMenu
		} = this.properties;

		if (
			!this._registry ||
			includes(evt.changedPropertyKeys, 'customResultItem') ||
			includes(evt.changedPropertyKeys, 'customResultMenu')) {

			const registry = this._createRegistry(customResultItem, customResultMenu);
			if (this._registry) {
				this.registries.replace(this._registry, registry);
			}
			else {
				this.registries.add(registry);
			}
			this._registry = registry;
		}
	}

	protected renderMenu(results: any[]): WNode | null {
		const { theme = {}, isResultDisabled } = this.properties;

		if (results.length === 0 || !this._open) {
			return null;
		}

		return w('result-menu', <ResultMenuProperties> {
			bind: this,
			id: uuid(),
			registry: this._registry,
			results,
			selectedIndex: this._activeIndex,
			getResultLabel: this._getResultLabel,
			isResultDisabled,
			onResultMouseDown: this._onResultMouseDown,
			onResultMouseEnter: this._onResultMouseEnter,
			onResultMouseUp: this._onResultMouseUp,
			theme
		});
	}

	render(): DNode {
		const {
			clearable,
			disabled,
			formId,
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
		const menuId = menu ? (<ResultMenuProperties> menu.properties).id : '';
		this._onMenuChange();
		this._wasOpen = this._open;

		let controls: DNode = v('div', {
			classes: this.classes(css.controls)
		}, [
			w(TextInput, {
				...inputProperties,
				bind: this,
				classes: this.classes(clearable ? css.clearable : null),
				controls: menuId,
				disabled,
				invalid,
				readOnly,
				required,
				value,
				onBlur: this._onInputBlur,
				onFocus: this._onInputFocus,
				onInput: this._onInput,
				onKeyDown: this._onInputKeyDown,
				extraClasses: css,
				theme
			}),
			clearable ? v('button', {
				'aria-controls': menuId,
				bind: this,
				classes: this.classes(css.clear),
				disabled,
				readOnly,
				innerHTML: 'clear combo box',
				onclick: this._onClearClick
			}) : null,
			v('button', {
				'aria-controls': menuId,
				bind: this,
				classes: this.classes(css.arrow),
				disabled,
				readOnly,
				innerHTML: 'open combo box',
				onclick: this._onArrowClick
			})
		]);

		if (label) {
			controls = w(Label, {
				bind: this,
				formId,
				label
			}, [ controls ]);
		}

		return v('div', {
			'aria-expanded': this._open ? 'true' : 'false',
			'aria-haspopup': 'true',
			'aria-readonly': readOnly ? 'true' : 'false',
			'aria-required': required ? 'true' : 'false',
			bind: this,
			classes: this.classes(css.root),
			key: 'root',
			role: 'combobox'
		}, [
			controls,
			menu
		]);
	}
}
