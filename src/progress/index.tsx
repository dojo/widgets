import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';
import { formatAriaProperties } from '../common/util';
import { DNode } from '@dojo/framework/core/interfaces';
import * as css from '../theme/default/progress.m.css';

export interface ProgressProperties extends ThemedProperties {
	/** Custom aria attributes */
	aria?: { [key: string]: string | null };
	/** Value used to calculate percent width */
	max?: number;
	/** Value used to calculate percent width */
	min?: number;
	/** A function used to determine the output display */
	output?(value: number, percent: number): string;
	/** Toggles visibility of progress bar output */
	showOutput?: boolean;
	/** The current value */
	value: number;
	/** Value used to supply a dom id to the element with role="progressbar" */
	widgetId?: string;
}

@theme(css)
export class Progress extends ThemedMixin(WidgetBase)<ProgressProperties> {
	private _output(value: number, percent: number) {
		const { output } = this.properties;
		return output ? output(value, percent) : `${percent}%`;
	}

	protected renderProgress(percent: number): DNode[] {
		return [
			v('div', {
				classes: this.theme(css.progress),
				styles: {
					width: `${percent}%`
				}
			})
		];
	}

	protected render(): DNode {
		const {
			aria = {},
			value,
			showOutput = true,
			max = 100,
			min = 0,
			widgetId
		} = this.properties;

		const percent = Math.round(((value - min) / (max - min)) * 100);
		const output = this._output(value, percent);

		return v('div', { classes: [this.variant(), this.theme(css.root)] }, [
			v(
				'div',
				{
					...formatAriaProperties(aria),
					classes: this.theme(css.bar),
					role: 'progressbar',
					'aria-valuemin': `${min}`,
					'aria-valuemax': `${max}`,
					'aria-valuenow': `${value}`,
					'aria-valuetext': output,
					id: widgetId
				},
				this.renderProgress(percent)
			),
			showOutput ? v('span', { classes: this.theme(css.output) }, [output]) : null
		]);
	}
}

export default Progress;
