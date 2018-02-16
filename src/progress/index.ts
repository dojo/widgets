import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';
import { DNode } from '@dojo/widget-core/interfaces';
import * as css from '../theme/progress.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * @type ProgressProperties
 *
 * Properties that can be set on a Progress component
 *
 * @property value          The current value
 * @property output         A function used to determine the output display
 * @property showOutput     Toggles visibility of progess bar output
 * @property max            Value used to calculate percent width
 * @property min            Value used to calculate percent width
 * @property id             Value used to supply a dom id
 */
export interface ProgressProperties extends ThemedProperties, CustomAriaProperties {
	value: number;
	output?(value: number, percent: number): string;
	showOutput?: boolean;
	max?: number;
	min?: number;
	id?: string;
}

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<ProgressProperties>({
	tag: 'dojo-progress',
	properties: [ 'theme', 'aria', 'extraClasses', 'output', 'showOutput', 'max', 'min', 'value' ],
	attributes: [ 'id' ],
	events: [ ]
})
export class ProgressBase<P extends ProgressProperties = ProgressProperties> extends ThemedBase<P, null> {
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
			id
		} = this.properties;

		const percent = Math.round(((value - min) / (max - min)) * 100);
		const output = this._output(value, percent);

		return v('div', { classes: this.theme(css.root) }, [
			v('div', {
				...formatAriaProperties(aria),
				classes: this.theme(css.bar),
				role: 'progressbar',
				'aria-valuemin': `${min}`,
				'aria-valuemax': `${max}`,
				'aria-valuenow': `${value}`,
				'aria-valuetext': output,
				id
			}, this.renderProgress(percent)),
			showOutput ? v('span', { classes: this.theme(css.output) }, [ output ]) : null
		]);
	}
}

export default class Progress extends ProgressBase<ProgressProperties> {}
