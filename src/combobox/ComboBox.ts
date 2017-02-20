import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode, HNode } from '@dojo/widget-core/interfaces';
import { assign } from '@dojo/core/lang';

import * as css from './styles/comboBox.css';

export interface ComboBoxProperties extends ThemeableProperties {
	value: string;
	results?: any[];
	getResultValue?(result: any): string;
	renderMenu?(resultItems: any[]): DNode;
	renderResult?(result: any): DNode;
	onChange?(value: string): void;
	onRequestResults?(value: string): void;
};

@theme(css)
export default class ComboBox extends ThemeableMixin(WidgetBase)<ComboBoxProperties> {
	private ignoreBlur: boolean;
	private inputElement: HTMLInputElement | null;
	private focused: boolean;
	private open: boolean;
	private selectedIndex: number | undefined;

	private handlers: {[key: string]: any} = {
		ArrowDown(this: ComboBox, event: KeyboardEvent) {
			const { results } = this.properties;
			if (!this.open || !results || results.length === 0) {
				return;
			}
			event.preventDefault();
			this.selectedIndex = this.selectedIndex === undefined || this.selectedIndex === results.length - 1 ? 0 : this.selectedIndex + 1;
			this.invalidate();
		},

		ArrowUp(this: ComboBox, event: KeyboardEvent) {
			const { results } = this.properties;
			if (!this.open || !results || results.length === 0) {
				return;
			}
			event.preventDefault();
			this.selectedIndex = this.selectedIndex === undefined || this.selectedIndex === 0 ? results.length - 1 : this.selectedIndex - 1;
			this.invalidate();
		},

		Enter(this: ComboBox) {
			const {
				results,
				onChange,
				getResultValue = this.getResultValue
			} = this.properties;

			if (!this.open || !results || results.length === 0) {
				return;
			}
			else if (this.selectedIndex === undefined) {
				this.open = false;
				this.invalidate();
			}
			else {
				const value = getResultValue(results[this.selectedIndex]);
				this.open = false;
				this.selectedIndex = undefined;
				onChange && onChange(value);
			}
		},

		Escape(this: ComboBox) {
			this.open = false;
			this.selectedIndex = undefined;
			this.invalidate();
		}
	};

	afterCreate(element: HTMLElement) {
		this.inputElement = element.querySelector('input');
		this.focused && this.inputElement!.focus();
	}

	afterUpdate(element: HTMLElement) {
		this.focused && this.inputElement!.focus();
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
		this.selectedIndex = undefined;
		this.open = true;
		onChange && onChange((<HTMLInputElement> event.target).value);
		onRequestResults && onRequestResults((<HTMLInputElement> event.target).value);
	}

	onInputFocus(event: FocusEvent) {
		this.ignoreBlur = false;
		this.focused = true;
	}

	onInputBlur(event: FocusEvent) {
		if (this.ignoreBlur) {
			return;
		}
		this.open = false;
		this.focused = false;
		this.selectedIndex = undefined;
		this.invalidate();
	}

	onInputKeyDown(event: KeyboardEvent) {
		if (this.handlers[event.key]) {
			this.handlers[event.key].call(this, event);
		}
	}

	onArrowClick(event: MouseEvent) {
		const { onRequestResults } = this.properties;
		this.open = true;
		this.focused = true;
		onRequestResults && onRequestResults(this.inputElement!.value);
	}

	onResultMouseEnter(event: MouseEvent) {
		this.selectedIndex = Number((<HTMLInputElement> event.target).getAttribute('data-index'));
		this.invalidate();
	}

	onResultMouseDown() {
		this.ignoreBlur = true;
	}

	onResultMouseUp(event: MouseEvent) {
		const {
			onChange,
			results,
			getResultValue = this.getResultValue
		} = this.properties;
		if (this.selectedIndex === undefined || !results || results.length === 0) {
			return;
		}
		const value = getResultValue(results[this.selectedIndex]);
		this.open = false;
		this.focused = true;
		this.selectedIndex = undefined;
		onChange && onChange(value);
	}

	onMenuMouseLeave() {
		this.selectedIndex = undefined;
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
				classes: this.classes(i === this.selectedIndex ? css.selectedResult : null).get(),
				onmouseenter: this.onResultMouseEnter,
				onmousedown: this.onResultMouseDown,
				onmouseup: this.onResultMouseUp,
				'data-index': String(i),
				'data-selected': i === this.selectedIndex ? 'true' : 'false'
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
			results = []
		} = this.properties;

		return v('div', {
			classes: this.classes(css.combobox).get(),
			afterCreate: this.afterCreate,
			afterUpdate: this.afterUpdate
		}, [
			v('input', {
				classes: this.classes(css.input).get(),
				onblur: this.onInputBlur,
				onfocus: this.onInputFocus,
				oninput: this.onInput,
				onkeydown: this.onInputKeyDown,
				value: value
			}),
			v('span', {
				classes: this.classes(css.arrow).get(),
				onclick: this.onArrowClick
			}, [ '↓' ]),
			this.open ? this.renderMenu(results) : null
		]);
	}
}
