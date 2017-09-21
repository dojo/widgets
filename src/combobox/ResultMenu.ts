import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v, w } from '@dojo/widget-core/d';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import ResultItem from './ResultItem';

import * as css from './styles/comboBox.m.css';

/**
 * @type ResultMenuProperties
 *
 * Properties that can be set on a ResultMenu component
 *
 * @property getResultLabel         Can be used to get the text label of a result based on the underlying result object
 * @property id                     An ID to apply to the ResultMenu DOM element
 * @property isResultDisabled       Used to determine if an item should be disabled
 * @property onResultMouseDown      Called when mouse clicks a result item
 * @property onResultMouseEnter     Called when mouse enters a result item
 * @property onResultMouseUp        Called when mouse releases a result item
 * @property results                List of result data objects
 * @property selectedIndex          Position of the selected result in the list of results
 */
export interface ResultMenuProperties extends ThemeableProperties {
	getResultLabel(result: any): string;
	id?: string;
	isResultDisabled?(result: any): boolean;
	onResultMouseDown(event: MouseEvent, index: number): void;
	onResultMouseEnter(event: MouseEvent, index: number): void;
	onResultMouseUp(event: MouseEvent, index: number): void;
	results: any[];
	selectedIndex: number | undefined;
}

export const ResultMenuBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ResultMenu extends ResultMenuBase<ResultMenuProperties> {
	renderResults(results: WNode[]): any[] {
		return results;
	}

	render(): DNode {
		const {
			getResultLabel,
			id,
			isResultDisabled = () => false,
			onResultMouseDown,
			onResultMouseEnter,
			onResultMouseUp,
			results,
			selectedIndex,
			theme = {}
		} = this.properties;

		const resultElements = this.renderResults(results.map((result, i) => w<ResultItem>('result-item', {
			getResultLabel,
			index: i,
			isDisabled: isResultDisabled,
			key: String(i),
			onMouseDown: onResultMouseDown,
			onMouseEnter: onResultMouseEnter,
			onMouseUp: onResultMouseUp,
			result,
			selected: i === selectedIndex,
			theme
		})));

		return v('div', {
			classes: this.classes(css.dropdown),
			id,
			role: 'listbox'
		}, resultElements);
	}
}
