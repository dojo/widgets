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
 * @property focusable		Determines whether the item can receive focus with tab key.
 * @property hasMenu		Indicates whether the widget is used as the label for a menu.
 * @property hasPopup		Indicates whether the widget has a drop down child.
 * @property id				Specifies the ID for the widget.
 * @property index			Specifies the index of the item within a parent menu.
 * @property onClick		Called when the widget is activated via a click or space key.
 * @property onKeyDown		Called when keys are pressed while the widget has focus.
 * @property properties		Additional properties for the widget's vnode.
 * @property selected		Determines whether the widget is marked as selected.
 * @property tag			The HTML tag name to use for the widget's vnode. Defaults to 'a'.
 * @property type			The type of the menu item. Defaults to 'item'.
 */
export interface MenuItemProperties extends ThemeableProperties {
	active?: boolean;
	controls?: string;
	disabled?: boolean;
	expanded?: boolean;
	focusable?: boolean;
	hasMenu?: boolean;
	hasPopup?: boolean;
	id?: string;
	index?: number;
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
			controls,
			disabled = false,
			expanded = false,
			focusable,
			hasPopup = false,
			hasMenu = false,
			id,
			index,
			properties,
			selected = false,
			tag = 'a',
			type = 'item'
		} = this.properties;

		const classes = this.classes(
			hasMenu ? css.menuLabel : css.menuItem,
			disabled ? css.disabled : null,
			selected ? css.selected : null
		);

		const itemProperties: { [key: string]: any; } = {
			'aria-controls': controls,
			'aria-expanded': hasPopup ? String(expanded) : undefined,
			'aria-haspopup': hasPopup ? 'true' : undefined,
			'aria-disabled': disabled ? 'true' : undefined,
			'data-dojo-index': typeof index === 'number' ? String(index) : undefined,
			classes,
			id,
			key: 'root',
			onclick: this._onClick,
			onkeydown: this._onKeyDown,
			role: roleMap[type],
			tabIndex: focusable ? 0 : -1
		};

		if (type === 'checkbox' || type === 'radio') {
			itemProperties['aria-checked'] = String(selected);
		}

		return v(tag, assign(Object.create(null), properties, itemProperties), this.children);
	}

	protected onElementUpdated(element: HTMLElement, key: string) {
		if (key === 'root') {
			let visibility = getComputedStyle(element).getPropertyValue('visibility');

			if (this.properties.active) {
				if (visibility === 'hidden') {
					// When animating from `visibility: hidden`, some browsers will mark the element as visible
					// within the next task, whereas others may take multiple tasks before the element switches
					// to visible.
					let callCount = 0;
					const scheduleFocus = () => {
						requestAnimationFrame(() => {
							visibility = getComputedStyle(element).getPropertyValue('visibility');

							if (this.properties.active) {
								if (visibility === 'hidden') {
									if (callCount > 30) {
										console.warn('Hidden elements cannot receive focus.');
									}
									else {
										callCount++;
										scheduleFocus();
									}
								}
								else {
									element.focus();
								}
							}
						});
					};
					scheduleFocus();
				}
				else {
					element.focus();
				}
			}
		}
	}

	private _onClick(event: MouseEvent) {
		const { disabled, onClick } = this.properties;

		if (!disabled && onClick) {
			onClick(event);
		}
	}

	private _onKeyDown(event: KeyboardEvent) {
		const { disabled, onKeyDown } = this.properties;
		const isSpaceKey = event.keyCode === SPACE_KEY;

		if (isSpaceKey) {
			event.preventDefault();
			event.stopPropagation();
		}

		if (!disabled) {
			onKeyDown && onKeyDown(event);
			if (isSpaceKey) {
				(<HTMLElement> event.target).click();
			}
		}
	}
}

export default MenuItem;
