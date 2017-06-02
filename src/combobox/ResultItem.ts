import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';

import * as css from './styles/comboBox.m.css';

/**
 * @type ResultItemProperties
 *
 * Properties that can be set on a ResultItem component
 *
 * @property getResultLabel  Can be used to get the text label of a result based on the underlying result object
 * @property index           Position of this result in a list of results
 * @property isDisabled      Used to determine if an item should be disabled
 * @property onMouseDown     Called when mouse clicks this result item
 * @property onMouseEnter    Called when mouse enters this result item
 * @property onMouseUp       Called when mouse releases this result item
 * @property result          Data object associated with this item
 * @property selected        Determines whether or not this item is selected
 */
export interface ResultItemProperties extends ThemeableProperties {
	getResultLabel(result: any): string;
	index: number;
	isDisabled(result: any): boolean;
	onMouseDown(event: MouseEvent, index: number): void;
	onMouseEnter(event: MouseEvent, index: number): void;
	onMouseUp(event: MouseEvent, index: number): void;
	result: any;
	selected: boolean;
}

export const ResultItemBase = ThemeableMixin(WidgetBase);

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

	renderResult(result: any): DNode {
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
				css.option,
				selected ? css.selected : null,
				isDisabled(result) ? css.disabledOption : null
			),
			'data-selected': selected ? 'true' : 'false',
			onmousedown: this._onMouseDown,
			onmouseenter: this._onMouseEnter,
			onmouseup: this._onMouseUp,
			role: 'option'
		}, [
			this.renderResult(result)
		]);
	}
}
