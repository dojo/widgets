import { DNode, WidgetProperties } from '@dojo/widget-core/interfaces';
import { ThemeableMixin, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';

import * as css from './styles/tooltip.m.css';

/**
 * @type TooltipProperties
 *
 * Properties that can be set on Tooltip components
 *
 * @property content           Information to show within the tooltip
 * @property orientation       Where this tooltip should render relative to its child
 * @property showing           Determines if this tooltip is visible
 */
export interface TooltipProperties extends WidgetProperties {
	content: DNode;
	orientation?: Orientation;
	showing?: boolean;
};

// Enum used to position the Tooltip
export const enum Orientation {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
};

const orientationCss: {[key: string]: any} = css;

export const TooltipBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Tooltip extends TooltipBase<TooltipProperties> {
	protected getFixedModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		return [
			css.rootFixed,
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
			classes: this.classes(css.content).fixed(css.contentFixed)
		}, [ this.properties.content ]);
	}

	protected renderTarget(): DNode {
		return v('div', this.children);
	}

	render(): DNode {
		const { showing } = this.properties;
		const classes = this.getModifierClasses();
		const fixedClasses = this.getFixedModifierClasses();

		return v('div', {
			classes: this.classes(...classes).fixed(...fixedClasses)
		}, [
			this.renderTarget(),
			showing ? this.renderContent() : null
		]);
	}
}
