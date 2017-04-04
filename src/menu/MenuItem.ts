import { assign } from '@dojo/core/lang';
import { v } from '@dojo/widget-core/d';
import { VirtualDomProperties } from '@dojo/widget-core/interfaces';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menu.m.css';

export type MenuItemType = 'item' | 'checkbox' | 'radio';

/**
 * @type MenuItemProperties
 *
 * Properties that can be set on a MenuItem component.
 *
 * @property active			Determines whether the item should receive focus.
 * @property controls		The ID of an element that this input controls.
 * @property disabled		Indicates whether the item is disabled.
 * @property expanded		Indicates whether a widget controlled by `this` is expanded.
 * @property hasMenu		Indicates whether the widget is used as the label for a menu.
 * @property hasPopup		Indicates whether the widget has a drop down child.
 * @property onClick		Called when the widget is activated via a click or space key.
 * @property onKeyDown		Called when keys are pressed while the widget has focus.
 * @property properties		Additional properties for the widget's vnode.
 * @property selected		Determines whether the widget is marked as selected.
 * @property tag			The HTML tag name to use for the widget's vnode. Defaults to 'span'.
 * @property type			The type of the menu item. Defaults to 'item'.
 */
export interface MenuItemProperties extends ThemeableProperties {
	active?: boolean;
	controls?: string;
	disabled?: boolean;
	expanded?: boolean;
	hasMenu?: boolean;
	hasPopup?: boolean;
	onClick?: (event: MouseEvent) => void;
	onKeyDown?: (event: KeyboardEvent) => void;
	properties?: VirtualDomProperties;
	selected?: boolean;
	tag?: string;
	type?: MenuItemType;
}

export const MenuItemBase = ThemeableMixin(WidgetBase);

const SPACE_KEY = 32;
const roleMap: { [key: string]: string } = {
	item: 'menuitem',
	checkbox: 'menuitemcheckbox',
	radio: 'menuitemradio'
};

@theme(css)
export class MenuItem extends MenuItemBase<MenuItemProperties> {
	render() {
		const {
			active = false,
			controls,
			disabled = false,
			expanded = false,
			hasPopup = false,
			hasMenu = false,
			properties,
			selected = false,
			tag = 'span',
			type = 'item'
		} = this.properties;

		const classes = this.classes(
			hasMenu ? css.menuLabel : css.menuItem,
			disabled ? css.disabled : null,
			selected ? css.selected : null
		);

		const itemProperties: { [key: string]: any; } = {
			'aria-controls': controls,
			'aria-expanded': String(expanded),
			'aria-haspopup': hasPopup ? 'true' : undefined,
			'aria-disabled': String(disabled),
			classes,
			key: 'root',
			onclick: this.onClick,
			onkeydown: this.onKeyDown,
			role: roleMap[type],
			tabIndex: active ? 0 : -1
		};

		if (type === 'checkbox' || type === 'radio') {
			itemProperties['aria-checked'] = String(selected);
		}

		return v(tag, assign(Object.create(null), properties, itemProperties), this.children);
	}

	protected onClick(event: MouseEvent) {
		const { disabled, onClick } = this.properties;
		if (!disabled && onClick) {
			onClick(event);
		}
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root') {
			this.properties.active && element.focus();
		}
	}

	protected onKeyDown(event: KeyboardEvent) {
		const { disabled, onKeyDown } = this.properties;
		if (!disabled) {
			if (event.keyCode === SPACE_KEY) {
				(<HTMLElement> event.target).click();
			}
			onKeyDown && onKeyDown(event);
		}
	}
}

export default MenuItem;
