import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import FactoryRegistry from '@dojo/widget-core/FactoryRegistry';
import { includes } from '@dojo/shim/array';
import ResultMenu, { ResultMenuProperties } from './ResultMenu';
import ResultItem from './ResultItem';
import TextInput from '../textinput/TextInput';
import Label, { LabelOptions } from '../label/Label';

import * as css from './styles/comboBox.css';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property autoBlur			Determines whether the input should blur after value selection
 * @property clearable			Determines whether the input should be able to be cleared
 * @property customResultItem	Can be used to render a custom result
 * @property customResultMenu	Can be used to render a custom result menu
 * @property disabled			Prevents user interaction and styles content accordingly
 * @property formId				ID of a form element associated with the form field
 * @property inputProperties	HTML properties supported by FormLabelMixin to set on the underlying input
 * @property invalid			Determines if this input is valid
 * @property label				Label to show for this input
 * @property openOnFocus		Determines whether the result list should open when the input is focused
 * @property readOnly			Prevents user interaction
 * @property required			Determines if this input is required, styles accordingly
 * @property results			Results for the current search term; should be set in response to `onRequestResults`
 * @property value				Value to set on the input
 * @property getResultLabel		Can be used to get the text label of a result based on the underlying result object
 * @property onBlur				Called when the input is blurred
 * @property onChange			Called when the value changes
 * @property onFocus			Called when the input is focused
 * @property onRequestResults	Called when results are shown; should be used to set `results`
 * @property onMenuChange		Called when menu visibility changes
 */
export interface ComboBoxProperties extends ThemeableProperties {
	autoBlur?: boolean;
	clearable?: boolean;
	customResultItem?: any;
	customResultMenu?: any;
	disabled?: boolean;
	formId?: string;
	inputProperties?: any;
	invalid?: boolean;
	label?: string | LabelOptions;
	openOnFocus?: boolean;
	readOnly?: boolean;
	required?: boolean;
	results?: any[];
	value?: string;
	getResultLabel?(result: any): string;
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onRequestResults?(value: string): void;
	onMenuChange?(open: boolean): void;
};

const enum Operation {
	increase,
	decrease,
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

	private _handlers: {[key: string]: any} = {
		[keys.up](this: ComboBox, event: KeyboardEvent) {
			event.preventDefault();
			this.updateSelectedIndex(Operation.decrease);
			this.invalidate();
		},

		[keys.down](this: ComboBox, event: KeyboardEvent) {
			event.preventDefault();
			this.updateSelectedIndex(Operation.increase);
			this.invalidate();
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
				this.selectResult(results[this._selectedIndex]);
			}
		},

		[keys.escape](this: ComboBox) {
			this.updateSelectedIndex(Operation.reset);
			this._open = false;
			this.invalidate();
		}
	};

	updateSelectedIndex(operation?: Operation, index?: number) {
		const { results } = this.properties;

		if (!results || results.length === 0 || !this._open) {
			return;
		}

		if (index !== undefined) {
			this._selectedIndex = index;
		}
		else if (operation !== undefined) {
			if (operation === Operation.increase || operation === Operation.decrease) {
				const increment = operation === Operation.increase ? 1 : -1;
				const total = results.length;
				const current = this._selectedIndex;
				const base = operation === Operation.increase ? -1 : 0;

				this._selectedIndex = ((current === undefined ? base : current) + increment + total) % total;
			}
			else {
				this._selectedIndex = undefined;
			}
			this._direction = operation;
		}
	}

	createRegistry() {
		const {
			customResultItem = ResultItem,
			customResultMenu = ResultMenu
		} = this.properties;

		const registry = new FactoryRegistry();
		registry.define('result-item', customResultItem);
		registry.define('result-menu', customResultMenu);
		return registry;
	}

	@onPropertiesChanged
	onPropertiesChanged(evt: PropertiesChangeEvent<this, ComboBoxProperties>) {
		if (!this.registry || includes(evt.changedPropertyKeys, 'customResultItem') || includes(evt.changedPropertyKeys, 'customResultMenu')) {
			this.registry = this.createRegistry();
		}
	}

	afterCreate(element: HTMLElement) {
		this._inputElement = <HTMLInputElement> element.querySelector('input');
		// Maintain focused state
		this._inputElement && this._inputElement[this._focused ? 'focus' : 'blur']();
	}

	afterUpdate(element: HTMLElement) {
		// Maintain focused state
		this._inputElement && this._inputElement[this._focused ? 'focus' : 'blur']();
		// Make sure highlighted result is visible after arrow up / arrow down
		const selectedResult = element.querySelector('[data-selected="true"]');
		selectedResult && this.scrollIntoView(<HTMLElement> selectedResult);
	}

	scrollIntoView(element: HTMLElement) {
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

	onInput(event: Event) {
		const {
			onRequestResults,
			onChange
		} = this.properties;

		this.updateSelectedIndex(Operation.reset);
		this._open = true;
		onChange && onChange((<HTMLInputElement> event.target).value);
		onRequestResults && onRequestResults((<HTMLInputElement> event.target).value);
	}

	onInputFocus(event: FocusEvent) {
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

	onInputBlur(event: FocusEvent) {
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

	onInputKeyDown(event: KeyboardEvent) {
		this._handlers[event.keyCode] && this._handlers[event.keyCode].call(this, event);
	}

	onArrowClick() {
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
		this._inputElement && onRequestResults && onRequestResults(this._inputElement.value);
	}

	onClearClick() {
		const { onChange } = this.properties;
		this._focused = true;
		onChange && onChange('');
	}

	onResultMouseEnter(index: number) {
		this.updateSelectedIndex(undefined, index);
		this.invalidate();
	}

	onResultMouseDown() {
		this._ignoreBlur = true;
	}

	onResultMouseUp() {
		const { results } = this.properties;

		if (!results || this._selectedIndex === undefined) {
			return;
		}

		this.selectResult(results[this._selectedIndex]);
	}

	selectResult(result: any) {
		const {
			autoBlur,
			onChange
		} = this.properties;

		this.updateSelectedIndex(Operation.reset);
		this._open = false;
		this._focused = !autoBlur;
		this._ignoreFocus = true;
		onChange && onChange(this.getResultLabel(result));
	}

	getResultLabel(result: any): string {
		const { getResultLabel } = this.properties;
		return getResultLabel ? getResultLabel(result) : result;
	}

	renderMenu(results: any[]) {
		const menu = w('result-menu', <ResultMenuProperties> {
			registry: this.registry,
			results: results,
			selectedIndex: this._selectedIndex,
			getResultLabel: this.getResultLabel,
			skipResult: () => {
				this.updateSelectedIndex(this._direction);
				this.invalidate();
			},
			onResultMouseEnter: this.onResultMouseEnter,
			onResultMouseDown: this.onResultMouseDown,
			onResultMouseUp: this.onResultMouseUp
		});

		return results.length > 0 ? menu : null;
	}

	render(): DNode {
		const {
			clearable,
			disabled,
			formId,
			label,
			readOnly,
			results = [],
			inputProperties = {},
			value = '',
			onMenuChange
		} = this.properties;

		const menu = this.renderMenu(results);

		menu && this._open && !this._wasOpen && onMenuChange && onMenuChange(true);
		menu && !this._open && this._wasOpen && onMenuChange && onMenuChange(false);

		this._wasOpen = this._open;

		const container = v('div', {
			classes: this.classes(css.combobox),
			afterCreate: this.afterCreate,
			afterUpdate: this.afterUpdate
		}, [
			// Use TextInput once landed
			w(TextInput, {
				bind: this,
				classes: this.classes(clearable ? css.clearable : null),
				disabled,
				readOnly,
				onBlur: this.onInputBlur,
				onFocus: this.onInputFocus,
				onInput: this.onInput,
				onKeyDown: this.onInputKeyDown,
				value,
				overrideClasses: css,
				...inputProperties
			}),
			clearable ? v('button', {
				bind: this,
				classes: this.classes(css.clear),
				innerHTML: 'clear combo box',
				onclick: this.onClearClick
			}) : null,
			v('button', {
				bind: this,
				classes: this.classes(css.arrow),
				innerHTML: 'open combo box',
				onclick: this.onArrowClick
			}),
			this._open ? menu : null
		]);

		if (label) {
			return w(Label, {
				formId,
				label
			}, [ container ]);
		}

		return container;
	}
}
