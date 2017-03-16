import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { RegistryMixin, RegistryMixinProperties } from '@dojo/widget-core/mixins/Registry';
import { v, w } from '@dojo/widget-core/d';
import { DNode, WNode } from '@dojo/widget-core/interfaces';
import { ResultItemProperties } from './ResultItem';

import * as css from './styles/comboBox.css';

/**
 * @type ResultMenuProperties
 *
 * Properties that can be set on a ResultMenu component
 *
 * @property id                     An ID to apply to the ResultMenu DOM element
 * @property results                List of result data objects
 * @property selectedIndex          Position of the selected result in the list of results
 * @property getResultLabel         Can be used to get the text label of a result based on the underlying result object
 * @property skipResult             Called when a disabled result is selected to skip to next ResultMenuBase
 * @property onResultMouseEnter     Called when mouse enters a result item
 * @property onResultMouseDown      Called when mouse clicks a result item
 * @property onResultMouseUp        Called when mouse releases a result item
 */
export interface ResultMenuProperties extends ThemeableProperties, RegistryMixinProperties {
	id?: string;
	results: any[];
	selectedIndex: number | undefined;
	getResultLabel(result: any): string;
	skipResult(): void;
	onResultMouseEnter(index: number): void;
	onResultMouseDown(event: MouseEvent): void;
	onResultMouseUp(event: MouseEvent): void;
};

const ResultMenuBase = RegistryMixin(ThemeableMixin(WidgetBase));

@theme(css)
export default class ResultMenu extends ResultMenuBase<ResultMenuProperties> {
	renderResults(results: WNode[]): any[] {
		return results;
	}

	render(): DNode {
		const {
			id,
			results,
			selectedIndex,
			getResultLabel,
			skipResult,
			onResultMouseEnter,
			onResultMouseDown,
			onResultMouseUp
		} = this.properties;

		const resultElements = this.renderResults(results.map((result, i) => w('result-item', <ResultItemProperties> {
			id,
			index: i,
			key: String(i),
			label: getResultLabel(result),
			result,
			selected: i === selectedIndex,
			skipResult: skipResult,
			onMouseEnter: onResultMouseEnter,
			onMouseDown: onResultMouseDown,
			onMouseUp: onResultMouseUp
		})));

		return v('div', {
			classes: this.classes(css.results),
			id,
			role: 'listbox'
		}, resultElements);
	}
}
