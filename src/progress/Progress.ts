import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import * as css from './styles/progress.m.css';
import { HNode } from '@dojo/widget-core/interfaces';

/**
 * @type ProgressProperties
 *
 * Properties that can be set on a Progress component
 *
 * @property value            The current value
 * @property output...........A function used to determine the output display
 * @property showOutput.......Toggles visibility of progess bar output
 * @property max..............Value used to calculate percent width
 * @property min..............Value used to calculate percent width
 */
export interface ProgressProperties extends ThemedProperties {
	value: number;
	output?(value: number, percent: number): string;
	showOutput?: boolean;
	max?: number;
	min?: number;
}

export const ProgressBase = ThemedMixin(WidgetBase);

@theme(css)
export default class Progress extends ProgressBase<ProgressProperties> {
	private _output(value: number, percent: number) {
		const { output } = this.properties;
		return output ? output(value, percent) : `${percent}%`;
	}

	protected renderProgress(percent: number): HNode[] {
		return [
			v('div', {
				classes: this.theme(css.progress),
				styles: {
					width: `${percent}%`
				}
			})
		];
	}

	render() {
		const {
			value,
			showOutput = true,
			max = 100,
			min = 0
		} = this.properties;

		const percent = Math.round(((value - min) / (max - min)) * 100);
		const output = this._output(value, percent);

		return v('div', { classes: this.theme(css.root) }, [
			v('div', {
				classes: this.theme(css.bar),
				role: 'progressbar',
				'aria-valuemin': `${min}`,
				'aria-valuemax': `${max}`,
				'aria-valuenow': `${value}`,
				'aria-valuetext': output
			}, this.renderProgress(percent)),
			showOutput ? v('span', { classes: this.theme(css.output) }, [ output ]) : null
		]);
	}
}
