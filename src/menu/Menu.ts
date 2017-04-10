import { createHandle } from '@dojo/core/lang';
import uuid from '@dojo/core/uuid';
import { v } from '@dojo/widget-core/d';
import { DNode } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menu.m.css';

export type Orientation = 'horizontal' | 'vertical';

export type Role = 'menu' | 'menubar';

/**
 * @type MenuProperties
 *
 * Properties that can be set on a Menu component.
 *
 * @property active				Determines whether the menu has focus.
 * @property activeIndex		Determines the index of the focused item.
 * @property disabled			Determines whether the menu is disabled.
 * @property id					The widget ID. Defaults to a random string.
 * @property nested				Indicates whether the menu is nested within another menu.
 * @property orientation		Determines whether the menu is rendered horizontally.
 * @property role				The value to use for the menu's `role` property. Defaults to 'menu'.
 */
export interface MenuProperties extends ThemeableProperties {
	active?: boolean;
	activeIndex?: number;
	disabled?: boolean;
	id?: string;
	nested?: boolean;
	orientation?: Orientation;
	role?: Role;
}

export const enum Operation {
	decrease,
	increase
}

export const enum Keys {
	down = 40,
	enter = 13,
	escape = 27,
	left = 37,
	right = 39,
	space =  32,
	tab = 9,
	up = 38
};

export const MenuBase = ThemeableMixin(WidgetBase);

@theme(css)
export class Menu extends MenuBase<MenuProperties> {
	private _active = false;
	private _activeIndex = 0;
	private _domNode: HTMLElement | null;
	private _id = uuid();

	constructor() {
		/* istanbul ignore next: disregard transpiled `super`'s "else" block */
		super();
		// TODO: Remove once focus management is implemented.
		this.own(createHandle(() => {
			this._domNode = null;
		}));
	}

	render(): DNode {
		const {
			id = this._id,
			role = 'menu'
		} = this.properties;

		return v('div', {
			classes: this.classes.apply(this, this._getMenuClasses()),
			id,
			key: 'root',
			onfocusin: this._onMenuFocus,
			onfocusout: this._onMenuFocusOut,
			onkeydown: this._onMenuKeyDown,
			onmousedown: this._onMenuMouseDown,
			role
		}, this._renderChildren());
	}

	protected onElementCreated(element: HTMLElement, key: string) {
		if (key === 'root') {
			this._domNode = element;
		}
	}

	private _getDefaultOrientation(): Orientation {
		const { role = 'menu' } = this.properties;
		return role === 'menubar' ? 'horizontal' : 'vertical';
	}

	private _getKeys() {
		const { orientation = this._getDefaultOrientation() } = this.properties;
		const isHorizontal = orientation === 'horizontal';

		return {
			decrease: isHorizontal ? Keys.left : Keys.up,
			increase: isHorizontal ? Keys.right : Keys.down,
			tab: Keys.tab
		};
	}

	private _getMenuClasses() {
		const { nested, orientation = this._getDefaultOrientation() } = this.properties;
		const classes = [ css.root ];

		if (orientation === 'horizontal') {
			classes.push(css.horizontal);
		}

		if (nested) {
			classes.push(css.nestedMenu);
		}

		return classes;
	}

	private _isActive() {
		return this._active || this.properties.active;
	}

	private _moveActiveIndex(operation: Operation) {
		const max = this.children.length;
		const previousIndex = this._activeIndex;
		this._activeIndex = operation === Operation.decrease ?
			previousIndex - 1 < 0 ? max - 1 : previousIndex - 1 :
			Math.min(previousIndex + 1, max) % max;

		this.invalidate();
	}

	private _onMenuFocus() {
		if (!this._isActive()) {
			this._active = true;
			this.invalidate();
		}
	}

	private _onMenuFocusOut() {
		if (this._isActive()) {
			requestAnimationFrame(() => {
				const node = this._domNode as HTMLElement;
				if (node && !node.contains(document.activeElement)) {
					this._active = false;
					this.invalidate();
				}
			});
		}
	}

	private _onMenuKeyDown(event: KeyboardEvent) {
		const keys = this._getKeys();

		switch (event.keyCode) {
			case keys.tab:
				event.stopPropagation();
				this._active = false;
				this.invalidate();
				break;
			case keys.decrease:
				event.preventDefault();
				event.stopPropagation();
				this._moveActiveIndex(Operation.decrease);
				break;
			case keys.increase:
				event.preventDefault();
				event.stopPropagation();
				this._moveActiveIndex(Operation.increase);
				break;
		}
	}

	private _onMenuMouseDown(event: MouseEvent) {
		let itemNode = <HTMLElement> event.target;
		while (!itemNode.hasAttribute('data-dojo-index') && itemNode.parentElement) {
			itemNode = itemNode.parentElement;
		}

		const { id = this._id } = this.properties;
		const index = parseInt(itemNode.getAttribute('data-dojo-index') || '', 10);
		const menuId = itemNode.getAttribute('data-dojo-menuid');

		if (menuId === id && !isNaN(index)) {
			this._activeIndex = index;
		}
	}

	private _renderChildren() {
		const { activeIndex = this._activeIndex, id = this._id } = this.properties;
		const focusIndex = this._isActive() ? activeIndex : undefined;
		this._activeIndex = activeIndex;

		this.children.filter((child: any) => child && child.properties)
			.forEach((child: any, i) => {
				child.properties.active = i === focusIndex;
				child.properties.focusable = i === activeIndex;
				child.properties.index = i;
				child.properties.menuId = id;
			});

		return this.children;
	}
}

export default Menu;
