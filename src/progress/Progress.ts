import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/progress.m.css';

/**
 * @type ProgressProperties
 *
 * Properties that can be set on a Progress component
 *
 * @property value            The current value
 * @property output...........A function used to determine the output display
 * @property showOutput.......Toggles visibility of progess bar output
 * @property max..............Value used to calculate percent width
 */
export interface ProgressProperties extends ThemedProperties {
	value: number;
	output?(value: number, percent: number): string;
	showOutput?: boolean;
	max?: number;
}

export const ProgressBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Progress extends ProgressBase<ProgressProperties> {
	private _output(value: number, percent: number) {
		const { output } = this.properties;
		return output ? output(value, percent) : `${percent}%`;
	}

	render(): DNode {
		const {
			value,
			showOutput = true,
			max = 100
		} = this.properties;

		const percent = Math.round((value / max) * 100);

		return v('div', { classes: this.theme(css.root) }, [
			v('div', { classes: this.theme(css.bar) }, [
				v('div', {
					classes: this.theme(css.progress),
					styles: {
						width: `${percent}%`
					}
				})
			]),
			showOutput ? v('output', [ this._output(value, percent) ]) : null
		]);
	}
}
