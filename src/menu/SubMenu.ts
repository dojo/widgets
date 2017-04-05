import { createTimer } from '@dojo/core/util';
import uuid from '@dojo/core/uuid';
import { Handle } from '@dojo/interfaces/core';
import { v, w } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import StatefulMixin from '@dojo/widget-core/mixins/Stateful';
import ThemeableMixin, { theme } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import Menu, { Keys, MenuProperties, Orientation, Role } from './Menu';
import MenuItem from './MenuItem';
import * as css from './styles/menu.m.css';

/**
 * @type MenuProperties
 *
 * Properties that can be set on a Menu component.
 *
 * @property active				Determines whether the menu trigger is active (should have focus).
 * @property animate			Determines whether animation should be handled internally.
 * @property expandOnClick		Determines whether a menu is displayed on click (default) or hover.
 * @property focusable			Determines whether the menu trigger can receive focus with tab key.
 * @property hidden				Determines whether the menu is hidden.
 * @property hideDelay			The amount of time (in milliseconds) after mouseleave before hiding the menu.
 * @property hideOnActivate		Determines whether the menu should be hidden when an item is activated. Defaults to true.
 * @property index				Specifies the index of the menu trigger within a parent menu.
 * @property label				A DNode to use as the trigger for a nested menu.
 * @property onRequestHide		Called when the menu is displayed and the trigger is activated.
 * @property onRequestShow		Called when the menu is hidden and the trigger is activated.
 * @property parentOrientation	Indicates the orientation of the menu's parent (if applicable).
 */
export interface SubMenuProperties extends MenuProperties {
	active?: boolean;
	animate?: boolean;
	expandOnClick?: boolean;
	focusable?: boolean;
	hidden?: boolean;
	hideDelay?: number;
	hideOnActivate?: boolean;
	index?: number;
	label: DNode;
	onRequestHide?: () => void;
	onRequestShow?: () => void;
	parentOrientation?: Orientation;
}

function getMenuHeight(menuElement: HTMLElement): number {
	const maxHeight = parseInt(getComputedStyle(menuElement).getPropertyValue('max-height'), 10);
	return Math.min(menuElement.scrollHeight, (isNaN(maxHeight) ? Infinity : maxHeight));
}

export const SubMenuBase = StatefulMixin(ThemeableMixin(WidgetBase));

@theme(css)
export class SubMenu extends SubMenuBase<SubMenuProperties> {
	private _activeIndex = 0;
	private _domNode: HTMLElement | null;
	private _hideTimer: Handle;
	private _id = uuid();
	private _initialRender = true;
	private _isLabelActive = false;
	private _wasOpen = false;

	constructor() {
		super();
		// TODO: Remove once focus management is implemented.
		this.own({ destroy: () => {
			this._domNode = null;
		}});
	}

	render(): DNode {
		const label = this.renderLabel();
		const menu = this.renderMenu();

		this._isLabelActive = false;
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
			active,
			disabled,
			focusable,
			hidden = true,
			id = this._id,
			index,
			label,
			overrideClasses
		} = this.properties;
		const labelActive = this._isLabelActive || active;

		return w(MenuItem, {
			active: labelActive,
			controls: id,
			disabled,
			expanded: !hidden,
			focusable,
			hasMenu: true,
			index,
			overrideClasses: overrideClasses || css,
			onClick: this._onLabelClick,
			onKeyDown: this._onLabelKeyDown
		}, [ label ]);
	}

	renderMenu() {
		const {
			animate = true,
			hidden = true,
			id = this._id,
			orientation
		} = this.properties;

		const menu = w(Menu, <MenuProperties> {
			active: this.state.active && !this._isLabelActive,
			activeIndex: hidden ? 0 : undefined,
			nested: true,
			orientation,
			role: <Role> 'menu'
		}, this.children);

		const classes = [ css.subMenu ];
		if (this._initialRender || !animate) {
			classes.push(hidden ? css.hidden : css.visible);
		}

		return v('div', {
			classes: this.classes(...classes),
			id,
			key: 'menu'
		}, [ menu ]);
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'menu') {
			const { animate = true, hidden = true } = this.properties;
			this._initialRender = false;
			this._domNode = element;
			this._wasOpen = !hidden;

			if (animate && hidden) {
				element.style.height = '0';
			}
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'menu') {
			const { animate = true } = this.properties;

			if (!animate) {
				// In case `animate` was previously `true`, remove any `height` property set on the node.
				element.style.height = null;
				return;
			}

			this._animate(element);
		}
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

	private _exitMenu() {
		const { hidden = true } = this.properties;

		if (!hidden) {
			this._isLabelActive = true;
			this.setState({ active: false });
		}
	}

	private _animate(element: HTMLElement) {
		const { hidden = true } = this.properties;

		if (this._wasOpen !== hidden) {
			return;
		}

		// Assuming the menu has an `auto` height, manually apply the scroll height (or max-height if specified),
		// and animate to and from that.
		requestAnimationFrame(() => {
			const height = getMenuHeight(element);
			this._wasOpen = !hidden;

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

	private _onLabelClick() {
		const {
			disabled,
			expandOnClick = true
		} = this.properties;

		if (!disabled && expandOnClick) {
			this._isLabelActive = true;
			this._toggleDisplay();
		}
	}

	private _onLabelKeyDown(event: KeyboardEvent) {
		const { disabled } = this.properties;

		if (!disabled) {
			const keys = this._getKeys();
			const key = event.keyCode;

			if (key === keys.enter) {
				this._toggleDisplay();
			}
			else if (key === keys.descend) {
				if (key === Keys.down) {
					event.preventDefault();
				}

				this._toggleDisplay(true);
			}
		}
	}

	private _onMenuFocusOut() {
		requestAnimationFrame(() => {
			if (!(<HTMLElement> this._domNode).contains(document.activeElement)) {
				this.setState({ active: false });
			}
		});
	}

	private _onMenuKeyDown(event: KeyboardEvent) {
		const keys = this._getKeys();

		switch (event.keyCode) {
			case keys.space:
				this._onItemActivate();
				break;
			case keys.escape:
				event.stopPropagation();
				this._isLabelActive = true;
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
			!inactive && this.setState({ active: true });
			onRequestShow && onRequestShow();
		}
		else {
			this.setState({ active: false });
			this._activeIndex = 0;
			onRequestHide && onRequestHide();
		}
	}
}

export default SubMenu;
