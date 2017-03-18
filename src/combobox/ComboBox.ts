import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import WidgetRegistry from '@dojo/widget-core/WidgetRegistry';
import { includes } from '@dojo/shim/array';
import ResultMenu, { ResultMenuProperties } from './ResultMenu';
import ResultItem from './ResultItem';
import TextInput, { TextInputProperties } from '../textinput/TextInput';
import Label, { LabelOptions } from '../label/Label';
import uuid from '@dojo/core/uuid';

import * as css from './styles/comboBox.css';

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
 * @property inputProperties    HTML properties supported by FormLabelMixin to set on the underlying input
 * @property invalid            Determines if this input is valid
 * @property label              Label to show for this input
 * @property openOnFocus        Determines whether the result list should open when the input is focused
 * @property readOnly           Prevents user interaction
 * @property required           Determines if this input is required, styles accordingly
 * @property results            Results for the current search term; should be set in response to `onRequestResults`
 * @property value              Value to set on the input
 * @property getResultLabel     Can be used to get the text label of a result based on the underlying result object
 * @property isDisabled         Used to determine if an item should be disabled
 * @property onBlur             Called when the input is blurred
 * @property onChange           Called when the value changes
 * @property onFocus            Called when the input is focused
 * @property onRequestResults   Called when results are shown; should be used to set `results`
 * @property onMenuChange       Called when menu visibility changes
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
	isDisabled?(result: any): boolean;
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onRequestResults?(value: string): void;
	onMenuChange?(open: boolean): void;
};

// Enum used when traversing items using arrow keys
export const enum Operation {
	increase = 1,
	decrease = -1,
	reset
};

// This can go away when Safari decides to support KeyboardEvent.key
const keys = {
	escape: 27,
	enter: 13,
	up: 38,
	down: 40
};

export const ComboBoxBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ComboBox extends ComboBoxBase<ComboBoxProperties> {
	private _ignoreBlur: boolean;
	private _ignoreFocus: boolean;
	private _inputElement: HTMLInputElement;
	private _focused: boolean;
	private _open: boolean;
	private _direction: Operation;
	private _selectedIndex: number | undefined;
	private _wasOpen: boolean;

	private _nextIndex(operation?: Operation) {
		const {
			results = [],
			isDisabled
		} = this.properties;

		const total = results.length;
		let index = this._selectedIndex;
		let curr = 0;

		while (isDisabled(results[index])) {

		}
	}

	private _handlers: {[key: string]: any} = {
		[keys.up](this: ComboBox, event: KeyboardEvent) {
			event.preventDefault();
			this.updateSelectedIndex(Operation.decrease);
			this.invalidate();
		},

		[keys.down](this: ComboBox, event: KeyboardEvent) {
			event.preventDefault();
			const { onRequestResults } = this.properties;

			if (!this._open) {
				this._open = true;
				onRequestResults && onRequestResults(this._inputElement.value);
			}
			else {
				this.updateSelectedIndex(Operation.increase);
				this.invalidate();
			}
		},

		[keys.enter](this: ComboBox) {
			const { results } = this.properties;

			// If results already closed or no results, do nothing
			if (!this._open || !results || results.length === 0) {
				return;
			}
			// If no result selected, close menu
			else if (this._selectedIndex === undefined) {
				this._open = false;
				this.invalidate();
			}
			else {
				this._selectResult(results[this._selectedIndex]);
			}
		},

		[keys.escape](this: ComboBox) {
			this.updateSelectedIndex(Operation.reset);
			this._open = false;
			this.invalidate();
		}
	};

	private _afterCreate(element: HTMLElement) {
		this._inputElement = <HTMLInputElement> element.querySelector('input');
		this._restoreFocus();
	}

	private _afterUpdate(element: HTMLElement) {
		this._restoreFocus();
		// Make sure highlighted result is visible after arrow up / arrow down
		const selectedResult = element.querySelector('[data-selected="true"]');
		selectedResult && this.scrollIntoView(<HTMLElement> selectedResult);
	}

	private _createRegistry() {
		const {
			customResultItem = ResultItem,
			customResultMenu = ResultMenu
		} = this.properties;

		const registry = new WidgetRegistry();
		registry.define('result-item', customResultItem);
		registry.define('result-menu', customResultMenu);
		return registry;
	}

	private _getResultLabel(result: any): string {
		const { getResultLabel } = this.properties;
		return getResultLabel ? getResultLabel(result) : result;
	}

	private _onArrowClick() {
		const {
			onRequestResults,
			disabled,
			readOnly
		} = this.properties;

		if (disabled || readOnly) {
			return;
		}

		this._open = true;
		this._focused = true;
		onRequestResults && onRequestResults(this._inputElement.value);
	}

	private _onClearClick() {
		const { onChange } = this.properties;
		this._focused = true;
		onChange && onChange('');
	}

	private _onInput(event: Event) {
		const {
			onRequestResults,
			onChange
		} = this.properties;

		this.updateSelectedIndex(Operation.reset);
		this._open = true;
		onChange && onChange((<HTMLInputElement> event.target).value);
		onRequestResults && onRequestResults((<HTMLInputElement> event.target).value);
	}

	private _onInputBlur(event: FocusEvent) {
		const { onBlur } = this.properties;

		if (this._ignoreBlur) {
			return;
		}

		this.updateSelectedIndex(Operation.reset);
		this._open = false;
		this._focused = false;
		onBlur && onBlur((<HTMLInputElement> event.target).value);
		this.invalidate();
	}

	private _onInputFocus(event: FocusEvent) {
		const {
			openOnFocus,
			onFocus,
			onRequestResults
		} = this.properties;

		const value = (<HTMLInputElement> event.target).value;

		this._focused = true;
		this._ignoreBlur = false;
		onFocus && onFocus(value);

		if (openOnFocus && !this._ignoreFocus) {
			this._open = true;
			onRequestResults && onRequestResults(value);
		}

		this._ignoreFocus = false;
	}

	private _onInputKeyDown(event: KeyboardEvent) {
		this._handlers[event.keyCode] && this._handlers[event.keyCode].call(this, event);
	}

	private _onResultMouseDown() {
		this._ignoreBlur = true;
	}

	private _onResultMouseEnter(index: number) {
		const {
			results = [],
			isDisabled
		} = this.properties;

		if (isDisabled && isDisabled(results[index])) {
			return;
		}

		this.updateSelectedIndex(undefined, index);
		this.invalidate();
	}

	private _onResultMouseUp() {
		const {
			results = [],
			isDisabled
		} = this.properties;

		if (this._selectedIndex === undefined) {
			return;
		}

		const result = results[this._selectedIndex];

		if (!result || (isDisabled && isDisabled(result))) {
			return;
		}

		this._selectResult(results[this._selectedIndex]);
	}

	private _notifyMenuChange() {
		const {
			results = [],
			onMenuChange
		} = this.properties;

		if (!onMenuChange || results.length === 0) {
			return;
		}

		if (this._open && !this._wasOpen) {
			onMenuChange(true);
		}
		else if (!this._open && this._wasOpen) {
			onMenuChange(false);
		}
	}

	private _renderMenu(results: any[], id?: string) {
		if (!this._open || results.length === 0) {
			return null;
		}

		const { isDisabled } = this.properties;

		return w('result-menu', <ResultMenuProperties> {
			bind: this,
			id,
			isDisabled,
			registry: this.registry,
			results,
			selectedIndex: this._selectedIndex,
			getResultLabel: this._getResultLabel,
			onResultMouseEnter: this._onResultMouseEnter,
			onResultMouseDown: this._onResultMouseDown,
			onResultMouseUp: this._onResultMouseUp
		});
	}

	private _restoreFocus() {
		const func = this._focused ? 'focus' : 'blur';
		this._inputElement[func]();
	}

	private _selectResult(result: any) {
		const {
			autoBlur,
			onChange
		} = this.properties;

		this.updateSelectedIndex(Operation.reset);
		this._open = false;
		this._focused = !autoBlur;
		this._ignoreFocus = true;
		onChange && onChange(this._getResultLabel(result));
	}

	@onPropertiesChanged
	protected onPropertiesChanged(evt: PropertiesChangeEvent<this, ComboBoxProperties>) {
		if (!this.registry || includes(evt.changedPropertyKeys, 'customResultItem') || includes(evt.changedPropertyKeys, 'customResultMenu')) {
			this.registry = this._createRegistry();
		}
	}

	protected scrollIntoView(element: HTMLElement) {
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

	protected updateSelectedIndex(operation?: Operation, index?: number) {
		const { results } = this.properties;

		if (!results || results.length === 0 || !this._open) {
			return;
		}

		if (index !== undefined) {
			this._selectedIndex = index;
		}
		else if (operation !== undefined) {
			if (operation === Operation.increase || operation === Operation.decrease) {
				const total = results.length;
				const base = operation === Operation.increase ? 0 : -1;
				const current = this._selectedIndex !== undefined ? this._selectedIndex + operation : base;
				this._selectedIndex = (current + total) % total;
			}
			else {
				this._selectedIndex = undefined;
			}
			this._direction = operation;
		}
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
			value = ''
		} = this.properties;

		const menuId = uuid();
		const menu = this._renderMenu(results, menuId);
		this._notifyMenuChange();

		this._wasOpen = this._open;

		const controls = v('div', {
			classes: this.classes(css.controls)
		}, [
			w(TextInput, {
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
				overrideClasses: css,
				...inputProperties
			}),
			clearable ? v('button', {
				'aria-controls': menuId,
				bind: this,
				classes: this.classes(css.clear),
				disabled,
				innerHTML: 'clear combo box',
				onclick: this._onClearClick
			}) : null,
			v('button', {
				'aria-controls': menuId,
				bind: this,
				classes: this.classes(css.arrow),
				disabled,
				innerHTML: 'open combo box',
				onclick: this._onArrowClick
			})
		]);

		return v('div', {
			afterCreate: this._afterCreate,
			afterUpdate: this._afterUpdate,
			'aria-expanded': this._open ? 'true' : 'false',
			'aria-haspopup': 'true',
			'aria-readonly': readOnly ? 'true' : 'false',
			'aria-required': required ? 'true' : 'false',
			bind: this,
			classes: this.classes(css.root),
			role: 'combobox'
		}, [
			label ? w(Label, {
				bind: this,
				formId,
				label
			}, [ controls ]) : controls,
			menu
		]);
	}
}
