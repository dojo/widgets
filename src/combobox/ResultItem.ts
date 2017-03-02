import { WidgetBase, onPropertiesChanged } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { DNode, PropertiesChangeEvent } from '@dojo/widget-core/interfaces';
import { includes } from '@dojo/shim/array';

import * as css from './styles/comboBox.css';

/**
 * @type ResultItemProperties
 *
 * Properties that can be set on a ResultItem component
 *
 * @property index			Position of this result in a list of results
 * @property label			The label to display for this result item
 * @property result			Data object associated with this item
 * @property selected		Determines whether or not this item is selected
 * @property skipResult		Called when a disabled result is selected to skip to next ResultMenuBase
 * @property onMouseEnter	Called when mouse enters this result item
 * @property onMouseDown	Called when mouse clicks this result item
 * @property onMouseUp		Called when mouse releases this result item
 */
export interface ResultItemProperties extends ThemeableProperties {
	index: number;
	label: string;
	result: any;
	selected: boolean;
	skipResult(): void;
	onMouseEnter(index: number): void;
	onMouseDown(event: MouseEvent): void;
	onMouseUp(event: MouseEvent): void;
};

const ResultItemBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class ResultItem extends ResultItemBase<ResultItemProperties> {
	@onPropertiesChanged
	onPropertiesChanged(evt: PropertiesChangeEvent<this, ResultItemProperties>) {
		if (includes(evt.changedPropertyKeys, 'selected')) {
			const {
				selected,
				skipResult
			} = this.properties;

			selected === true && this.isDisabled() && skipResult();
		}
	}

	isDisabled() {
		return false;
	}

	renderLabel(result: any) {
		const { label } = this.properties;
		return v('div', [ label ]);
	}

	onMouseEnter() {
		const {
			index,
			onMouseEnter
		} = this.properties;

		!this.isDisabled() && onMouseEnter(index);
	}

	onMouseDown(event: MouseEvent) {
		const { onMouseDown } = this.properties;

		!this.isDisabled() && onMouseDown(event);
	}

	onMouseUp(event: MouseEvent) {
		const { onMouseUp } = this.properties;

		!this.isDisabled() && onMouseUp(event);
	}

	render(): DNode {
		const {
			selected,
			result
		} = this.properties;

		return v('div', {
			classes: this.classes(
				css.result,
				selected ? css.selectedResult : null,
				this.isDisabled() ? css.disabledResult : null
			),
			onmouseenter: this.onMouseEnter,
			onmousedown: this.onMouseDown,
			onmouseup: this.onMouseUp,
			'data-selected': selected ? 'true' : 'false'
		}, [ this.renderLabel(result) ]);
	}
}
