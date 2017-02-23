import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { FormLabelMixinProperties } from '@dojo/widget-core/mixins/FormLabel';
import { v } from '@dojo/widget-core/d';
import { DNode, HNode } from '@dojo/widget-core/interfaces';
import { assign } from '@dojo/core/lang';

import * as css from './styles/comboBox.css';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property autoBlur			Determines whether the input should blur after value selection
 * @property clearable			Determines whether the input should be able to be cleared
 * @property inputProperties	HTML properties supported by FormLabelMixin to set on the underlying input
 * @property openOnFocus		Determines whether the result list should open when the input is focused
 * @property results			Results for the current search term; should be set in response to `onRequestResults`
 * @property value				Value to set on the input
 * @property getResultValue		Can be used to get the text value of a result based on the underlying result object
 * @property onBlur				Called when the input is blurred
 * @property onChange			Called when the value changes
 * @property onFocus			Called when the input is focused
 * @property onRequestResults	Called when results are shown; should be used to set `results`
 * @property onMenuChange		Called when menu visibility changes
 * @property renderMenu			Can be used to render a custom result menu
 * @property renderResult		Can be used to render a custom result
 */
export interface ComboBoxProperties extends ThemeableProperties {
	autoBlur?: boolean;
	clearable?: boolean;
	inputProperties?: FormLabelMixinProperties;
	openOnFocus?: boolean;
	results?: any[];
	value?: string;
	getResultValue?(result: any): string;
	onBlur?(value: string): void;
	onChange?(value: string): void;
	onFocus?(value: string): void;
	onRequestResults?(value: string): void;
	onMenuChange?(open: boolean): void;
	renderMenu?(resultItems: any[]): DNode;
	renderResult?(result: any): DNode;
};

@theme(css)
export default class ComboBox extends ThemeableMixin(WidgetBase)<ComboBoxProperties> {
	private _ignoreBlur: boolean;
	private _ignoreFocus: boolean;
	private _inputElement: HTMLInputElement | null;
	private _focused: boolean;
	private _open: boolean;
	private _selectedIndex: number | undefined;
	private _wasOpen: boolean;

	private _handlers: {[key: string]: any} = {
		ArrowDown(this: ComboBox, event: KeyboardEvent) {
			const { results } = this.properties;

			if (!this._open || !results || results.length === 0) {
				return;
			}

			// Increment highlighted result
			event.preventDefault();
			this._selectedIndex = this._selectedIndex === undefined || this._selectedIndex === results.length - 1 ? 0 : this._selectedIndex + 1;
			this.invalidate();
		},

		ArrowUp(this: ComboBox, event: KeyboardEvent) {
			const { results } = this.properties;

			if (!this._open || !results || results.length === 0) {
				return;
			}

			// Decrement highlighted result
			event.preventDefault();
			this._selectedIndex = this._selectedIndex === undefined || this._selectedIndex === 0 ? results.length - 1 : this._selectedIndex - 1;
			this.invalidate();
		},

		Enter(this: ComboBox) {
			const { results } = this.properties;

			if (!this._open || !results || results.length === 0) {
				return;
			}
			// If no result is highlighted, close menu
			else if (this._selectedIndex === undefined) {
				this._open = false;
				this.invalidate();
			}
			// Select the highlighted result
			else {
				this.selectResult(this.getResultValue(results[this._selectedIndex]));
			}
		},

		Escape(this: ComboBox) {
			// Close menu
			this._open = false;
			this._selectedIndex = undefined;
			this.invalidate();
		}
	};

	afterCreate(element: HTMLElement) {
		// Cache the input element and restore focus
		this._inputElement = element.querySelector('input');
		this._inputElement![this._focused ? 'focus' : 'blur']();
	}

	afterUpdate(element: HTMLElement) {
		// Cache the input element and restore focus
		this._inputElement![this._focused ? 'focus' : 'blur']();
		const selectedResult = element.querySelector('[data-selected="true"]');
		// Make sure highlighted result is visible after arrow up / arrow down
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

		// Open the menu and request new results as typing occurs
		this._selectedIndex = undefined;
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

		this._open = false;
		this._focused = false;
		this._selectedIndex = undefined;
		onBlur && onBlur((<HTMLInputElement> event.target).value);
		this.invalidate();
	}

	onInputKeyDown(event: KeyboardEvent) {
		this._handlers[event.key] && this._handlers[event.key].call(this, event);
	}

	onArrowClick() {
		const {
			onRequestResults,
			inputProperties
		} = this.properties;

		if (inputProperties && (inputProperties.disabled || inputProperties.readOnly)) {
			return;
		}

		this._open = true;
		this._focused = true;
		onRequestResults && onRequestResults(this._inputElement!.value);
	}

	onClearClick() {
		const { onChange } = this.properties;
		this._focused = true;
		onChange && onChange('');
	}

	onResultMouseEnter(event: MouseEvent) {
		// Update highlighted element; this is done via JS so mouse movement and arrow press
		// both change the same highlighted element
		this._selectedIndex = Number((<HTMLInputElement> event.target).getAttribute('data-index'));
		this.invalidate();
	}

	onResultMouseDown() {
		this._ignoreBlur = true;
	}

	onResultMouseUp() {
		const { results } = this.properties;

		this.selectResult(this.getResultValue(results![this._selectedIndex!]));
	}

	selectResult(value: string) {
		const {
			autoBlur,
			onChange
		} = this.properties;

		this._open = false;
		this._selectedIndex = undefined;
		this._focused = autoBlur ? false : true;
		this._ignoreFocus = true;
		onChange && onChange(value);
	}

	renderMenu(results: any[]): DNode {
		const {
			renderResult = (result: any): DNode => v('div', [ this.getResultValue(result) ]),
			renderMenu = (resultItems: any[]): DNode => v('div', { classes: this.classes(css.results).get() }, resultItems)
		} = this.properties;

		const resultItems = results.map((result, i) => {
			const renderedResult = <HNode> renderResult(result);
			assign(renderedResult!.properties, {
				classes: this.classes(i === this._selectedIndex ? css.selectedResult : null).get(),
				onmouseenter: this.onResultMouseEnter,
				onmousedown: this.onResultMouseDown,
				onmouseup: this.onResultMouseUp,
				// Attrs are not used for styling
				'data-index': String(i),
				'data-selected': i === this._selectedIndex ? 'true' : 'false'
			});
			return renderedResult;
		});

		const menu = <HNode> renderMenu(resultItems);

		return resultItems.length > 0 ? menu : null;
	}

	getResultValue(result: any) {
		const { getResultValue = (result: any) => result } = this.properties;
		// By default, the ComboBox expects a list of strings. Objects can be used
		// by passing a `getResultValue` property and returning the appropriate
		// property to be used for a result label
		return getResultValue(result);
	}

	render() {
		const {
			clearable,
			results = [],
			inputProperties = {},
			value = '',
			onMenuChange
		} = this.properties;

		const menu = this.renderMenu(results);

		menu && this._open && !this._wasOpen && onMenuChange && onMenuChange(true);
		menu && !this._open && this._wasOpen && onMenuChange && onMenuChange(false);

		this._wasOpen = this._open;

		return v('div', {
			classes: this.classes(css.combobox).get(),
			afterCreate: this.afterCreate,
			afterUpdate: this.afterUpdate
		}, [
			// TODO: Use TextInput once landed
			v('input', {
				classes: this.classes(css.input, clearable ? css.clearable : null).get(),
				onblur: this.onInputBlur,
				onfocus: this.onInputFocus,
				oninput: this.onInput,
				onkeydown: this.onInputKeyDown,
				value: value,
				...inputProperties
			}),
			clearable ? v('button', {
				classes: this.classes(css.clear).get(),
				innerHTML: 'clear combo box',
				onclick: this.onClearClick
			}) : null,
			v('button', {
				classes: this.classes(css.arrow).get(),
				innerHTML: 'open combo box',
				onclick: this.onArrowClick
			}),
			this._open ? menu : null
		]);
	}
}
