import { createTimer } from '@dojo/core/util';
import uuid from '@dojo/core/uuid';
import { Handle } from '@dojo/interfaces/core';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import Menu, { Keys, MenuProperties, Orientation, Role } from './Menu';
import MenuItem from './MenuItem';
import * as css from './styles/menu.m.css';

export type Animation = 'fade' | 'slide' | 'none';
export type MenuType = 'dropdown' | 'inline' | 'popup';

/**
 * @type MenuProperties
 *
 * Properties that can be set on a Menu component.
 *
 * @property active				Determines whether the submenu is active (should have focus).
 * @property animation			The animation type. Defaults to 'slide' for "inline" menus; otherwise, 'fade';
 * @property expandOnClick		Determines whether a menu is displayed on click (default) or hover.
 * @property focusable			Determines whether the menu trigger can receive focus with tab key.
 * @property hidden				Determines whether the menu is hidden.
 * @property hideOnBlur			Determines whether the menu should be hidden on blur. Defaults to true.
 * @property hideDelay			The amount of time (in milliseconds) after mouseleave before hiding the menu.
 * @property hideOnActivate		Determines whether the menu should be hidden when an item is activated. Defaults to true.
 * @property index				Specifies the index of the menu trigger within a parent menu.
 * @property label				A DNode to use as the trigger for a nested menu.
 * @property labelId			The ID for the menu trigger.
 * @property onRequestHide		Called when the menu is displayed and the trigger is activated.
 * @property onRequestShow		Called when the menu is hidden and the trigger is activated.
 * @property parentOrientation	Indicates the orientation of the menu's parent (if applicable).
 * @property position			The position for dropdown/popup menu in relation to the trigger.
 * @property type				Specifies the submenu's type.
 */
export interface SubMenuProperties extends MenuProperties {
	active?: boolean;
	animation?: Animation;
	expandOnClick?: boolean;
	focusable?: boolean;
	hidden?: boolean;
	hideOnBlur?: boolean;
	hideDelay?: number;
	hideOnActivate?: boolean;
	index?: number;
	label: DNode;
	labelId?: string;
	onRequestHide?: () => void;
	onRequestShow?: () => void;
	parentOrientation?: Orientation;
	position?: { x?: 'left' | 'right'; y?: 'bottom' | 'top' };
	type?: MenuType;
}

function getMenuHeight(menuElement: HTMLElement): number {
	const maxHeight = parseInt(getComputedStyle(menuElement).getPropertyValue('max-height'), 10);
	return Math.min(menuElement.scrollHeight, (isNaN(maxHeight) ? Infinity : maxHeight));
}

export const SubMenuBase = ThemeableMixin(WidgetBase);

// `this.properties.active` is set by parent widgets to indicate that the label should
// receive focus. From there, whether focus management within the submenu is handled
// by the `SubMenu`. If `active` is false, then neither the label nor the menu should
// receive focus. If `active` is true and `hidden` is true, then the label should
// receive focus. If `active` is true and `hidden` is false, then the menu should receive
// focus, unless `this._labelActive` is true, in which case the label should receive focus.

@theme(css)
export class SubMenu extends SubMenuBase<SubMenuProperties> {
	private _active = false;
	private _domNode: HTMLElement | null;
	private _hideTimer: Handle;
	private _id = uuid();
	private _initialRender = true;
	private _labelActive = false;
	private _labelId = uuid();
	private _wasOpen = false;

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();
		// TODO: Remove once focus management is implemented.
		this.own({ destroy: () => {
			this._domNode = null;
		}});
	}

	render(): DNode {
		const label = this.renderLabel();
		const menu = this.renderMenu();

		return v('div', {
			classes: this.classes(css.root, css.nestedMenuRoot),
			onfocusout: this._onMenuFocusOut,
			onkeydown: this._onMenuKeyDown,
			onmouseenter: this._onMenuMouseEnter,
			onmouseleave: this._onMenuMouseLeave
		}, [ label, menu ]);
	}

	renderLabel(): DNode {
		const {
			disabled,
			focusable,
			hidden = true,
			id = this._id,
			index,
			label,
			labelId = this._labelId,
			overrideClasses
		} = this.properties;

		return w(MenuItem, {
			active: this._isLabelActive(),
			controls: id,
			disabled,
			expanded: !hidden,
			focusable,
			hasMenu: true,
			id: labelId,
			index,
			overrideClasses: overrideClasses || css,
			onClick: this._onLabelClick,
			onKeyDown: this._onLabelKeyDown
		}, [ label ]);
	}

	renderMenu() {
		const {
			hidden = true,
			id = this._id,
			labelId = this._labelId,
			orientation
		} = this.properties;

		const menu = w(Menu, <MenuProperties> {
			active: this._isActive() && !this._isLabelActive(),
			activeIndex: hidden ? 0 : undefined,
			nested: true,
			orientation,
			role: <Role> 'menu'
		}, this.children);

		return v('div', {
			'aria-labelledby': labelId,
			classes: this.classes(...this._getMenuClasses()),
			id,
			key: 'menu'
		}, [ menu ]);
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'menu') {
			const { animation = this._getDefaultAnimation(), hidden = true } = this.properties;
			this._initialRender = false;
			this._domNode = element;
			this._wasOpen = !hidden;

			if (animation === 'slide' && hidden) {
				element.style.height = '0';
			}
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'menu') {
			const { animation = this._getDefaultAnimation() } = this.properties;

			if (animation !== 'slide') {
				// In case `animation` was previously 'slide', remove any `height` property set on the node.
				element.style.height = null;
			}

			if (animation !== 'fade') {
				// In case `animation` was previously 'fade', remove the added `fade` class.
				element.classList.remove(css.fade);
			}

			this._animate(element);
		}
	}

	private _animate(element: HTMLElement) {
		const { animation = this._getDefaultAnimation(), hidden = true } = this.properties;

		if (animation === 'none' || this._wasOpen !== hidden) {
			return;
		}

		this._wasOpen = !hidden;

		if (animation === 'fade') {
			element.classList.add(css.fade);
			return;
		}

		// Assuming the menu has an `auto` height, manually apply the scroll height (or max-height if specified),
		// and animate to and from that.
		requestAnimationFrame(() => {
			const height = getMenuHeight(element);

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

	private _exitMenu() {
		const { hidden = true } = this.properties;

		if (!hidden) {
			this._labelActive = true;
			this._inactivate();
		}
	}

	private _getDefaultAnimation(): Animation {
		const { type = 'inline' } = this.properties;
		return type === 'inline' ? 'slide' : 'fade';
	}

	private _getKeys() {
		const { orientation, parentOrientation } = this.properties;
		const isHorizontal = orientation === 'horizontal';

		return {
			ascend: isHorizontal ? Keys.up : Keys.left,
			decrease: isHorizontal ? Keys.left : Keys.up,
			descend: isHorizontal || parentOrientation === 'horizontal' ? Keys.down : Keys.right,
			enter: Keys.enter,
			escape: Keys.escape,
			increase: isHorizontal ? Keys.right : Keys.down,
			space: Keys.space,
			tab: Keys.tab
		};
	}

	private _getMenuClasses() {
		const { animation = this._getDefaultAnimation(), hidden = true, position, type = 'inline' } = this.properties;
		const classes = [ css.subMenu, type === 'dropdown' ? css.dropDown : (<any> css)[type] ];

		if (this._initialRender || animation !== 'slide') {
			classes.push(hidden ? css.hidden : css.visible);
		}

		if (animation === 'slide') {
			classes.push(css.slide);
		}

		if (position) {
			const { x, y } = position;
			x && classes.push((<any> css)[x]);
			y && classes.push((<any> css)[y]);
		}

		return classes;
	}

	private _inactivate() {
		this._active = false;
		this.invalidate();
	}

	private _isActive() {
		return this._active || this.properties.active;
	}

	private _isLabelActive() {
		const { active, hidden = true } = this.properties;
		return this._labelActive || (active && (hidden || !this._active));
	}

	private _onLabelClick() {
		const {
			disabled,
			expandOnClick = true
		} = this.properties;

		if (!disabled && expandOnClick) {
			this._labelActive = true;
			this._toggleDisplay();
		}
	}

	private _onLabelKeyDown(event: KeyboardEvent) {
		const { disabled } = this.properties;

		if (!disabled) {
			const keys = this._getKeys();
			const key = event.keyCode;

			if (key === keys.enter || key === keys.space) {
				this._toggleDisplay();
			}
			else if (key === keys.descend) {
				if (key === Keys.down) {
					event.preventDefault();
				}

				event.stopPropagation();
				this._labelActive = false;
				this._toggleDisplay(true);
			}
		}
	}

	private _onMenuFocusOut() {
		requestAnimationFrame(() => {
			const node = this._domNode as HTMLElement;
			if (node && !node.contains(document.activeElement)) {
				const { hideOnBlur = true } = this.properties;
				this._labelActive = false;

				if (hideOnBlur) {
					this._toggleDisplay(false);
				}
				else {
					this._inactivate();
				}
			}
		});
	}

	private _onMenuKeyDown(event: KeyboardEvent) {
		if (!this._active) {
			return;
		}

		const keys = this._getKeys();
		switch (event.keyCode) {
			case keys.space:
				this._onItemActivate();
				break;
			case keys.escape:
				event.stopPropagation();
				this._labelActive = true;
				this._toggleDisplay(false);
				break;
			case keys.ascend:
				event.preventDefault();
				event.stopPropagation();
				this._exitMenu();
				break;
		}
	}

	private _onItemActivate() {
		const { hideOnActivate = true } = this.properties;

		if (hideOnActivate) {
			this._toggleDisplay(false);
		}
	}

	private _onMenuMouseEnter() {
		const {
			disabled,
			expandOnClick = true
		} = this.properties;

		if (!disabled && !expandOnClick) {
			this._hideTimer && this._hideTimer.destroy();
			this._toggleDisplay(true, true);
		}
	}

	private _onMenuMouseLeave() {
		const {
			disabled,
			expandOnClick = true,
			hideDelay = 300
		} = this.properties;

		if (!disabled && !expandOnClick) {
			this._hideTimer && this._hideTimer.destroy();
			if (hideDelay) {
				this._hideTimer = createTimer(() => {
					this._toggleDisplay(false);
				}, hideDelay);
				this.own(this._hideTimer);
			}
			else {
				this._toggleDisplay(false);
			}
		}
	}

	private _toggleDisplay(requestShow?: boolean, inactive?: boolean) {
		const {
			onRequestHide,
			onRequestShow
		} = this.properties;

		if (typeof requestShow === 'undefined') {
			const { hidden = true } = this.properties;
			requestShow = hidden;
		}

		if (requestShow) {
			this._active = true;
			onRequestShow && onRequestShow();
		}
		else {
			this._active = false;
			onRequestHide && onRequestHide();
		}
	}
}

export default SubMenu;
