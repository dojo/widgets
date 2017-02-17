import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/comboBox.css';

/**
 * @type ComboBoxProperties
 *
 * Properties that can be set on a ComboBox component
 *
 * @property initialValue		Initial value to set on the ComboBox
 * @property resultKey			Specifies property to use as a label if results are objects
 * @property results 			Array of results based on the current search term
 * @property onRequestResults	Called when new results should be queried and set
 * @property onValueChange 		Called when the value of this widget changes
 */
export interface ComboBoxProperties extends ThemeableProperties {
	initialValue?: string;
	resultKey?: string;
	results?: any[];
	onRequestResults?(value: string): void;
	onValueChange?(value: string): void;
};

function isObject(value: any) {
	return value !== null && !Array.isArray(value) && typeof value === 'object';
}

@theme(css)
export default class ComboBox extends ThemeableMixin(WidgetBase)<ComboBoxProperties> {
	private inputElement: HTMLInputElement | null;
	private open: boolean;
	private focused: boolean;
	private rendered: boolean;
	private selectedResult: string;
	private index: number | null;
	private lastResults: any[];

	afterCreate(element: HTMLElement) {
		this.inputElement = element.querySelector('input');
		this.focused && this.inputElement!.focus();
	}

	afterUpdate(element: HTMLElement) {
		this.focused && this.inputElement!.focus();
	}

	onInput(event: Event) {
		const {
			onRequestResults,
			onValueChange
		} = this.properties;

		this.open = true;
		this.focused = true;
		this.index = null;

		onValueChange && onValueChange(this.inputElement!.value);
		onRequestResults && onRequestResults(this.inputElement!.value);
	}

	onArrowClick(event: MouseEvent) {
		const { onRequestResults } = this.properties;

		this.open = true;
		this.focused = true;
		this.index = null;

		onRequestResults && onRequestResults(this.inputElement!.value);
	}

	onResultMouseDown(event: MouseEvent) {
		const { onValueChange } = this.properties;
		const value = (<HTMLElement> event.target).innerHTML;

		this.inputElement!.value = value;

		onValueChange && onValueChange(value);
	}

	onInputBlur(event: FocusEvent) {
		this.open = false;
		this.focused = false;
		this.invalidate();
	}

	onInputKeyDown(event: KeyboardEvent) {
		if (!this.open) {
			return;
		}

		const { onValueChange } = this.properties;

		switch (event.key) {
			case 'ArrowDown':
				this.index = this.index === null || this.index === this.lastResults.length - 1 ? 0 : this.index + 1;
				this.invalidate();
				break;

			case 'ArrowUp':
				this.index = !this.index ? this.lastResults.length - 1 : this.index - 1;
				this.invalidate();
				break;

			case 'Enter':
				this.inputElement!.value = this.selectedResult;
				this.open = false;
				this.invalidate();
				onValueChange && onValueChange(this.selectedResult);
				break;
		}
	}

	render() {
		const {
			resultKey = 'name',
			initialValue = '',
			results = []
		} = this.properties;

		const inputProperties: {[key: string]: any} = {
			classes: this.classes(css.input).get(),
			oninput: this.onInput,
			onblur: this.onInputBlur,
			onkeydown: this.onInputKeyDown
		};

		if (!this.rendered) {
			inputProperties.value = initialValue;
			this.rendered = true;
		}

		const children = [
			v('input', inputProperties),
			// TODO: This will be a button when Sarah's stuff is merged
			v('span', {
				classes: this.classes(css.arrow).get(),
				onclick: this.onArrowClick
			}, [ '↓' ])
		];

		if (this.open) {
			const mappedResults = results.map((result: any, index: number) => {
				result = isObject(result) ? result[resultKey] : result;
				if (this.index === index) {
					this.selectedResult = result;
				}
				return v('div', {
					classes: this.classes(index === this.index! ? css.selectedResult : null).get()
				}, [ result ]);
			});

			mappedResults.length > 0 && children.push(v('div', {
				classes: this.classes(css.results).get(),
				onmousedown: this.onResultMouseDown
			}, mappedResults));

			this.lastResults = results;
		}

		return v('div', {
			classes: this.classes(css.combobox).get(),
			afterCreate: this.afterCreate,
			afterUpdate: this.afterUpdate
		}, children);
	}
}
