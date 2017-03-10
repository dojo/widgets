import { DNode } from '@dojo/widget-core/interfaces';
import { WidgetBase } from '@dojo/widget-core/WidgetBase';
import { ThemeableMixin, ThemeableProperties, theme } from '@dojo/widget-core/mixins/Themeable';
import { v } from '@dojo/widget-core/d';

import * as css from './styles/tabPane.css';

/**
 * @type TabButtonProperties
 *
 * Properties that can be set on a TabButton component
 *
 * @property active			Determines whether this tab button is active
 * @property closeable		Determines wehther this tab can be closed
 * @property disabled		Determines whether this tab can become active
 * @property index			The position of this tab button
 * @property loading		Determines whether the associated tab is loading
 * @property onClick		Called when this tab button is clicked
 * @property onCloseClick	Called when this tab button's close icon is clicked
 */
export interface TabButtonProperties extends ThemeableProperties {
	active?: boolean;
	closeable?: boolean;
	disabled?: boolean;
	index?: number;
	loading?: boolean;
	onClick?: (index?: number) => void;
	onCloseClick?: (index?: number) => void;
};

export const TabButtonBase = ThemeableMixin(WidgetBase);

@theme(css)
export default class TabButton extends TabButtonBase<TabButtonProperties> {
	onClick() {
		const {
			disabled,
			index,
			onClick
		} = this.properties;

		!disabled && onClick && onClick(index);
	}

	onCloseClick(event: MouseEvent) {
		const {
			index,
			onCloseClick
		} = this.properties;

		event.stopPropagation();
		onCloseClick && onCloseClick(index);
	}

	render(): DNode {
		const {
			active,
			closeable,
			disabled
		} = this.properties;

		const children = closeable ? this.children.concat([
			v('button', {
				classes: this.classes(css.close),
				innerHTML: 'close tab',
				onclick: this.onCloseClick
			})
		]) : this.children;

		return v('div', {
			classes: this.classes(
				css.tabButton,
				active ? css.activeTabButton : null,
				disabled ? css.disabledTabButton : null
			),
			onclick: this.onClick
		}, children);
	}
}
