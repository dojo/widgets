import { createTimer } from '@dojo/core/util';
import uuid from '@dojo/core/uuid';
import { Handle } from '@dojo/interfaces/core';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import MenuItem from './MenuItem';
import * as css from './styles/menu.m.css';

export type Role = 'menu' | 'menubar';

/**
 * @type MenuProperties
 *
 * Properties that can be set on a Menu component
 *
 * @property animate
 * Only applies to nested menus. A flag indicating whether the widget instance should handle animating between the
 * visible and hidden states. If true (the default), then the menu will slide into and out of view like an accordion.
 * If false, then any animation should be handled in the CSS, as the menu will just snap open/shut.
 *
 * @property disabled
 * Indicates whether the menu is disabled. If true, then the widget will ignore events.
 *
 * @property expandOnClick
 * Indicates whether the menu should be displayed/hidden via a click event. If false, then the menu is toggled
 * via a hover event. Defaults to true.
 *
 * @property hideDelay
 * Only applies to menus toggled into view with a hover event. The amount of time (in milliseconds) after a
 * mouseleave event that should pass before the menu is hidden. Defaults to 300ms.
 *
 * @property hidden
 * Whether the menu is hidden. Defaults to true if a label is specified (i.e., the menu is controlled by a
 * link); false otherwise.
 *
 * @property id
 * The widget ID. Defaults to a random string.
 *
 * @property label
 * A widget that will be wrapped in a MenuItem widget that will be used to control the menu.
 *
 * @property nested
 * Indicates whether the menu is nested within another menu. Useful for styling, this does not affect
 * functionality. Defaults to false.
 *
 * @property onRequestHide
 * Needed only when a label is used. Called when the menu is displayed, and the label is triggered.
 * This method should be used to update the widget's `hidden` property.
 *
 * @property onRequestShow
 * Needed only when a label is used. Called when the menu is hidden, and the label is triggered.
 * This method should be used to update the widget's `hidden` property.
 *
 * @property role
 * The value to use for the menu's `role` property. Defaults to "menu".
 */
export interface MenuProperties extends ThemeableProperties {
	animate?: boolean;
	disabled?: boolean;
	expandOnClick?: boolean;
	hideDelay?: number;
	hidden?: boolean;
	id?: string;
	label?: DNode;
	nested?: boolean;
	onRequestHide?: () => void;
	onRequestShow?: () => void;
	role?: Role;
}

function getMenuHeight(menuElement: HTMLElement): number {
	const maxHeight = parseInt(getComputedStyle(menuElement).getPropertyValue('max-height'), 10);
	return Math.min(menuElement.scrollHeight, (isNaN(maxHeight) ? Infinity : maxHeight));
}

export const MenuBase = ThemeableMixin(WidgetBase);

@theme(css)
export class Menu extends MenuBase<MenuProperties> {
	protected wasOpen = false;
	private _hideTimer: Handle;
	private _initialRender = true;

	onLabelClick() {
		const {
			disabled,
			expandOnClick = true
		} = this.properties;

		if (!disabled && expandOnClick) {
			this.toggleDisplay();
		}
	}

	onLabelKeypress(event: KeyboardEvent) {
		const { disabled } = this.properties;
		const key = 'key' in event ? event.key : event.keyCode;

		if (!disabled && key === 'Enter') {
			this.toggleDisplay();
		}
	}

	onMenuFocus() {
		const { disabled, hidden = this.getDefaultHidden() } = this.properties;
		if (!disabled && hidden) {
			this.toggleDisplay(true);
		}
	}

	onMenuMouseEnter() {
		const {
			disabled,
			expandOnClick = true
		} = this.properties;

		if (!disabled && !expandOnClick) {
			this._hideTimer && this._hideTimer.destroy();
			this.toggleDisplay(true);
		}
	}

	onMenuMouseLeave() {
		const {
			disabled,
			expandOnClick = true,
			hideDelay = 300
		} = this.properties;

		if (!disabled && !expandOnClick) {
			this._hideTimer && this._hideTimer.destroy();
			if (hideDelay) {
				this._hideTimer = createTimer(() => {
					this.toggleDisplay(false);
				}, hideDelay);
				this.own(this._hideTimer);
			}
			else {
				this.toggleDisplay(false);
			}
		}
	}

	render(): DNode {
		const {
			id = uuid(),
			nested,
			role = 'menu'
		} = this.properties;

		const label = this.renderLabel(id);
		const menu = v('nav', {
			id,
			role,
			classes: this.classes.apply(this, this.getMenuClasses()),
			afterCreate: this.afterCreate,
			afterUpdate: this.afterUpdate,
			onfocusin: this.onMenuFocus
		}, this.children);

		if (label) {
			return v('div', {
				classes: this.classes(css.container, nested ? css.nestedMenuContainer : null),
				onmouseenter: this.onMenuMouseEnter,
				onmouseleave: this.onMenuMouseLeave
			}, [ label, menu ]);
		}

		return menu;
	}

	renderLabel(id: string): DNode | void {
		const { disabled, hidden = this.getDefaultHidden(), label, overrideClasses } = this.properties;

		if (label) {
			return w(MenuItem, {
				controls: id,
				disabled,
				expanded: !hidden,
				hasMenu: true,
				overrideClasses: overrideClasses || css,
				onClick: this.onLabelClick,
				onKeypress: this.onLabelKeypress
			}, [ label ]);
		}
	}

	protected afterCreate(element: HTMLElement) {
		const { animate = true, hidden = this.getDefaultHidden() } = this.properties;
		this._initialRender = false;

		if (animate) {
			this.wasOpen = !hidden;

			if (hidden) {
				element.style.height = '0';
			}
		}
	}

	protected afterUpdate(element: HTMLElement) {
		const { animate = true, label } = this.properties;

		if (!label) {
			return;
		}

		if (!animate) {
			// In case `animate` was previously `true`, remove any `height` property set on the node.
			element.style.height = null;
			return;
		}

		this.animate(element);
	}

	protected animate(element: HTMLElement) {
		const { hidden = this.getDefaultHidden() } = this.properties;

		// Assuming the menu has an `auto` height, manually apply the scroll height (or max-height if specified),
		// and animate to and from that.
		requestAnimationFrame(() => {
			const height = getMenuHeight(element);
			this.wasOpen = !hidden;

			if (hidden) {
				// Temporarily remove any transition to prevent the element from animating to `height`.
				const transition = element.style.transition;
				element.style.transition = null;

				element.style.height = height + 'px';
				element.style.transition = transition;
				requestAnimationFrame(() => {
					element.style.height = '0';
				});
			}
			else {
				element.scrollTop = 0;
				element.style.height = `${height}px`;
			}
		});
	}

	protected getDefaultHidden() {
		const { disabled, label } = this.properties;

		if (label && disabled) {
			return true;
		}

		return label ? true : false;
	}

	protected getMenuClasses() {
		const { animate = true, hidden = this.getDefaultHidden(), label, nested } = this.properties;
		const isSubMenu = Boolean(label);
		const classes = [ css.menu ];

		if (this._initialRender || !animate || !isSubMenu) {
			classes.push(hidden ? css.hidden : css.visible);
		}

		if (nested) {
			classes.push(css.nestedMenu);
		}

		if (isSubMenu) {
			classes.push(css.subMenu);
		}

		return classes;
	}

	protected toggleDisplay(requestShow?: boolean) {
		const {
			onRequestHide,
			onRequestShow
		} = this.properties;

		if (typeof requestShow === 'undefined') {
			const { hidden = this.getDefaultHidden() } = this.properties;
			requestShow = hidden;
		}

		if (requestShow) {
			typeof onRequestShow === 'function' && onRequestShow();
		}
		else {
			typeof onRequestHide === 'function' && onRequestHide();
		}
	}
}

export default Menu;
