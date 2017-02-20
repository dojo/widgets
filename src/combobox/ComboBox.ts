import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode, HNode } from '@dojo/widget-core/interfaces';
import { assign } from '@dojo/core/lang';

import * as css from './styles/comboBox.css';

export interface ComboBoxProperties extends ThemeableProperties {
	inputProperties?: {[key: string]: any};
	results?: any[];
	value: string;
	getResultValue?(result: any): string;
	onChange?(value: string): void;
	onRequestResults?(value: string): void;
	onMenuChange?(open: boolean): void;
	renderMenu?(resultItems: any[]): DNode;
	renderResult?(result: any): DNode;
};

@theme(css)
export default class ComboBox extends ThemeableMixin(WidgetBase)<ComboBoxProperties> {
	private _ignoreBlur: boolean;
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
			event.preventDefault();
			this._selectedIndex = this._selectedIndex === undefined || this._selectedIndex === results.length - 1 ? 0 : this._selectedIndex + 1;
			this.invalidate();
		},

		ArrowUp(this: ComboBox, event: KeyboardEvent) {
			const { results } = this.properties;
			if (!this._open || !results || results.length === 0) {
				return;
			}
			event.preventDefault();
			this._selectedIndex = this._selectedIndex === undefined || this._selectedIndex === 0 ? results.length - 1 : this._selectedIndex - 1;
			this.invalidate();
		},

		Enter(this: ComboBox) {
			const {
				results,
				onChange,
				getResultValue = this.getResultValue
			} = this.properties;

			if (!this._open || !results || results.length === 0) {
				return;
			}
			else if (this._selectedIndex === undefined) {
				this._open = false;
				this.invalidate();
			}
			else {
				const value = getResultValue(results[this._selectedIndex]);
				this._open = false;
				this._selectedIndex = undefined;
				onChange && onChange(value);
			}
		},

		Escape(this: ComboBox) {
			this._open = false;
			this._selectedIndex = undefined;
			this.invalidate();
		}
	};

	afterCreate(element: HTMLElement) {
		this._inputElement = element.querySelector('input');
		this._focused && this._inputElement!.focus();
	}

	afterUpdate(element: HTMLElement) {
		this._focused && this._inputElement!.focus();
		const selectedResult = element.querySelector('[data-selected="true"]');
		selectedResult && this.scrollIntoView(<HTMLElement> selectedResult);
	}

	scrollIntoView(element: HTMLElement) {
		const menu = <HTMLElement> element.parentElement;
		if (element.offsetTop - menu.scrollTop < 0) {
			menu.scrollTop = element.offsetTop;
		}
		else if ((element.offsetTop - menu.scrollTop + element.offsetHeight) > menu.clientHeight) {
			menu.scrollTop = element.offsetTop - menu.clientHeight + element.offsetHeight;
		}
	}

	onInput(event: Event) {
		const {
			onRequestResults,
			onChange
		} = this.properties;
		this._selectedIndex = undefined;
		this._open = true;
		onChange && onChange((<HTMLInputElement> event.target).value);
		onRequestResults && onRequestResults((<HTMLInputElement> event.target).value);
	}

	onInputFocus(event: FocusEvent) {
		this._ignoreBlur = false;
		this._focused = true;
	}

	onInputBlur(event: FocusEvent) {
		if (this._ignoreBlur) {
			return;
		}
		this._open = false;
		this._focused = false;
		this._selectedIndex = undefined;
		this.invalidate();
	}

	onInputKeyDown(event: KeyboardEvent) {
		this._handlers[event.key] && this._handlers[event.key].call(this, event);
	}

	onArrowClick(event: MouseEvent) {
		const { onRequestResults } = this.properties;
		this._open = true;
		this._focused = true;
		onRequestResults && onRequestResults(this._inputElement!.value);
	}

	onResultMouseEnter(event: MouseEvent) {
		this._selectedIndex = Number((<HTMLInputElement> event.target).getAttribute('data-index'));
		this.invalidate();
	}

	onResultMouseDown() {
		this._ignoreBlur = true;
	}

	onResultMouseUp(event: MouseEvent) {
		const {
			onChange,
			results,
			getResultValue = this.getResultValue
		} = this.properties;
		if (this._selectedIndex === undefined || !results || results.length === 0) {
			return;
		}
		const value = getResultValue(results[this._selectedIndex]);
		this._open = false;
		this._focused = true;
		this._selectedIndex = undefined;
		onChange && onChange(value);
	}

	onMenuMouseLeave() {
		this._selectedIndex = undefined;
		this.invalidate();
	}

	renderMenu(results: any[]): DNode {
		const {
			getResultValue = this.getResultValue,
			renderResult = (result: any): DNode => v('div', [ getResultValue(result) ]),
			renderMenu = (resultItems: any[]): DNode => v('div', { classes: this.classes(css.results).get() }, resultItems)
		} = this.properties;

		const resultItems = results.map((result, i) => {
			const renderedResult = <HNode> renderResult(result);
			assign(renderedResult!.properties, {
				classes: this.classes(i === this._selectedIndex ? css.selectedResult : null).get(),
				onmouseenter: this.onResultMouseEnter,
				onmousedown: this.onResultMouseDown,
				onmouseup: this.onResultMouseUp,
				'data-index': String(i),
				'data-selected': i === this._selectedIndex ? 'true' : 'false'
			});
			return renderedResult;
		});

		const menu = <HNode> renderMenu(resultItems);
		assign(menu!.properties, {
			onmouseleave: this.onMenuMouseLeave
		});

		return resultItems.length > 0 ? menu : null;
	}

	getResultValue(result: any) {
		return result.label;
	}

	render() {
		const {
			value = '',
			results = [],
			inputProperties = {},
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
			// TODO: Use TextInput
			v('input', {
				classes: this.classes(css.input).get(),
				onblur: this.onInputBlur,
				onfocus: this.onInputFocus,
				oninput: this.onInput,
				onkeydown: this.onInputKeyDown,
				value: value,
				...inputProperties
			}),
			// TODO: Use button
			v('span', {
				classes: this.classes(css.arrow).get(),
				onclick: this.onArrowClick
			}, [ '↓' ]),
			this._open ? menu : null
		]);
	}
}
