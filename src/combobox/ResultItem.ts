import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/comboBox.css';

/**
 * @type ResultItemProperties
 *
 * Properties that can be set on a ResultItem component
 *
 * @property index           Position of this result in a list of results
 * @property result          Data object associated with this item
 * @property selected        Determines whether or not this item is selected
 * @property getResultLabel  Can be used to get the text label of a result based on the underlying result object
 * @property isDisabled      Used to determine if an item should be disabled
 * @property onMouseDown     Called when mouse clicks this result item
 * @property onMouseEnter    Called when mouse enters this result item
 * @property onMouseUp       Called when mouse releases this result item
 */
export interface ResultItemProperties extends ThemeableProperties {
	index: number;
	result: any;
	selected: boolean;
	getResultLabel(result: any): string;
	isDisabled(result: any): boolean;
	onMouseDown(event: MouseEvent, index: number): void;
	onMouseEnter(event: MouseEvent, index: number): void;
	onMouseUp(event: MouseEvent, index: number): void;
};

const ResultItemBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ResultItem extends ResultItemBase<ResultItemProperties> {
	private _onMouseDown(event: MouseEvent) {
		const {
			index,
			onMouseDown
		} = this.properties;

		onMouseDown(event, index);
	}

	private _onMouseEnter(event: MouseEvent) {
		const {
			index,
			onMouseEnter
		} = this.properties;

		onMouseEnter(event, index);
	}

	private _onMouseUp(event: MouseEvent) {
		const {
			onMouseUp,
			index
		} = this.properties;

		onMouseUp(event, index);
	}

	renderResult(result: any) {
		const { getResultLabel } = this.properties;

		return v('div', [ getResultLabel(result) ]);
	}

	render(): DNode {
		const {
			isDisabled,
			result,
			selected
		} = this.properties;

		return v('div', {
			'aria-selected': selected ? 'true' : 'false',
			'aria-disabled': isDisabled(result) ? 'true' : 'false',
			classes: this.classes(
				css.result,
				selected ? css.selectedResult : null,
				isDisabled(result) ? css.disabledResult : null
			),
			'data-selected': selected ? 'true' : 'false',
			role: 'option',
			onmousedown: this._onMouseDown,
			onmouseenter: this._onMouseEnter,
			onmouseup: this._onMouseUp
		}, [
			this.renderResult(result)
		]);
	}
}
