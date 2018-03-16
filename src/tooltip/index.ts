import { DNode } from '@dojo/widget-core/interfaces';
import { ThemedMixin, ThemedProperties, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { CustomAriaProperties } from '../common/interfaces';
import { formatAriaProperties } from '../common/util';

import * as fixedCss from './styles/tooltip.m.css';
import * as css from '../theme/tooltip.m.css';
import { customElement } from '@dojo/widget-core/decorators/customElement';

/**
 * @type TooltipProperties
 *
 * Properties that can be set on Tooltip components
 *
 * @property content           Information to show within the tooltip
 * @property orientation       Where this tooltip should render relative to its child
 * @property open              Determines if this tooltip is visible
 */
export interface TooltipProperties extends ThemedProperties, CustomAriaProperties {
	content: DNode;
	orientation?: Orientation;
	open?: boolean;
}

// Enum used to position the Tooltip
export enum Orientation {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
}

const fixedOrientationCss: {[key: string]: any} = fixedCss;
const orientationCss: {[key: string]: any} = css;

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(css)
@customElement<TooltipProperties>({
	tag: 'dojo-tooltip',
	properties: [ 'theme', 'aria', 'extraClasses', 'content', 'open' ],
	attributes: [ 'orientation' ],
	events: [ ]
})
export class TooltipBase<P extends TooltipProperties = TooltipProperties> extends ThemedBase<P> {
	protected getFixedModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		return [
			fixedCss.rootFixed,
			fixedOrientationCss[`${orientation}Fixed`]
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		return [
			orientationCss[orientation]
		];
	}

	protected renderContent(): DNode {
		const { aria = {} } = this.properties;
		return v('div', {
			...formatAriaProperties(aria),
			classes: [ this.theme(css.content), fixedCss.contentFixed ],
			key: 'content'
		}, [ this.properties.content ]);
	}

	protected renderTarget(): DNode {
		return v('div', { key: 'target' }, this.children);
	}

	render(): DNode {
		const { open } = this.properties;
		const classes = this.getModifierClasses();
		const fixedClasses = this.getFixedModifierClasses();

		return v('div', {
			classes: [ ...this.theme(classes), ...fixedClasses ]
		}, [
			this.renderTarget(),
			open ? this.renderContent() : null
		]);
	}
}

export default class Tooltip extends TooltipBase<TooltipProperties> {}
