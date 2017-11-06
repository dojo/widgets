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
 * @property hideEvent         Name of the event to hide the tooltip
 * @property onRequestHide     Called when the tooltip should be shown
 * @property onRequestShow     Called when the tooltip should be hidden
 * @property showEvent         Name of the event to show the tooltip
 * @property showing           Determines if this tooltip is visible
 */
export interface TooltipProperties extends WidgetProperties {
	content: DNode;
	hideEvent?: string;
	onRequestHide?(): void;
	onRequestShow?(): void;
	orientation?: Orientation;
	showEvent?: string;
	showing?: boolean;
};

// Enum used to position the Tooltip
export const enum Orientation {
	bottom = 'bottom',
	left = 'left',
	right = 'right',
	top = 'top'
};

export const TooltipBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class Tooltip extends TooltipBase<TooltipProperties> {
	private onRequestHide() {
		const { onRequestHide } = this.properties;
		onRequestHide && onRequestHide();
	}

	private onRequestShow() {
		const { onRequestShow } = this.properties;
		onRequestShow && onRequestShow();
	}

	protected getFixedModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		// https://github.com/Microsoft/TypeScript/issues/13042
		// const orientationCss: {[Key in Orientation]: string} = css;
		const orientationCss: {[key: string]: any} = css;

		return [
			css.rootFixed,
			orientationCss[`${orientation}Fixed`]
		];
	}

	protected getModifierClasses(): (string | null)[] {
		const { orientation = Orientation.right } = this.properties;

		// https://github.com/Microsoft/TypeScript/issues/13042
		// const orientationCss: {[Key in Orientation]: string} = css;
		const orientationCss: {[key: string]: any} = css;

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
		const {
			hideEvent = 'onmouseout',
			showEvent = 'onmouseover'
		} = this.properties;

		return v('div', {
			classes: this.classes(),
			[hideEvent]: this.onRequestHide,
			[showEvent]: this.onRequestShow
		}, this.children);
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
