import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemedMixin, theme } from '@dojo/widget-core/mixins/Themed';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as fixedCss from './styles/tooltip.m.css';
import * as themeCss from '../theme/tooltip/tooltip.m.css';

/**
 * @type TooltipProperties
 *
 * Properties that can be set on Tooltip components
 *
 * @property content           Information to show within the tooltip
 * @property orientation       Where this tooltip should render relative to its child
 * @property open              Determines if this tooltip is visible
 */
export interface TooltipProperties extends WidgetProperties {
	content: DNode;
	orientation?: Orientation;
	open?: boolean;
};

// Enum used to position the Tooltip
export const enum Orientation {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
};

const orientationCss: {[key: string]: any} = themeCss;

export const ThemedBase = ThemedMixin(WidgetBase);

@theme(themeCss)
export default class Tooltip<P extends TooltipProperties = TooltipProperties> extends ThemedBase<P> {
	protected getFixedModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		return [
			fixedCss.rootFixed,
			orientationCss[`${orientation}Fixed`]
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		return [
			orientationCss[orientation]
		];
	}

	protected renderContent(): DNode {
		return v('div', {
			classes: [ this.theme(themeCss.content), fixedCss.contentFixed ],
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
