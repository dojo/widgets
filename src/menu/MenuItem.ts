import { v } from '@dojo/widget-core/d';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menu.css';

/**
 * @type MenuItemProperties
 *
 * Properties that can be set on a MenuItem component
 *
 * @property controls
 * ID of an element that this input controls
 *
 * @property disabled
 * Indicates whether the menu is disabled. If true, then the widget will ignore events.
 *
 * @property expanded
 * A flag indicating whether a widget controlled by `this` is expanded.
 *
 * @property hasDropDown
 * A flag indicating whether the widget has a drop down child.
 *
 * @property hasMenu
 * A flag indicating whether the widget is used as the label for a menu widget. If `true`,
 * then the `menuLabel` CSS class is applied instead of the `menuItem` class.
 *
 * @property onClick
 * An event handler for click events.
 *
 * @property onKeypress
 * An event handler for keypress events.
 *
 * @property selected
 * Indicates whether the widget is selected.
 *
 * @property tabIndex
 * The tab index. Defaults to 0, and is forced to -1 if the widget is disabled.
 */
export interface MenuItemProperties extends ThemeableProperties {
	controls?: string;
	disabled?: boolean;
	expanded?: boolean;
	hasDropDown?: boolean;
	hasMenu?: boolean;
	onClick?: (event: MouseEvent) => void;
	onKeypress?: (event: KeyboardEvent) => void;
	selected?: boolean;
	tabIndex?: number;
}

export const MenuItemBase = ThemeableMixin(WidgetBase);

@theme(css)
export class MenuItem extends MenuItemBase<MenuItemProperties> {
	onClick(event: MouseEvent) {
		const { disabled, onClick } = this.properties;
		if (!disabled && typeof onClick === 'function') {
			onClick(event);
		}
	}

	onKeypress(event: KeyboardEvent) {
		const { disabled, onKeypress } = this.properties;
		if (!disabled && typeof onKeypress === 'function') {
			onKeypress(event);
		}
	}

	render() {
		const {
			controls,
			disabled,
			expanded,
			hasDropDown = false,
			hasMenu = false,
			selected,
			tabIndex = 0
		} = this.properties;

		const classes = this.classes(
			hasMenu ? css.menuLabel : css.menuItem,
			disabled ? css.disabled : null,
			selected ? css.selected : null
		);

		return v('span', {
			'aria-controls': controls,
			'aria-expanded': expanded,
			'aria-hasdropdown': hasDropDown,
			'aria-disabled': disabled,
			classes,
			onclick: this.onClick,
			onkeypress: this.onKeypress,
			role: 'menuitem',
			tabIndex : disabled ? -1 : tabIndex
		}, this.children);
	}
}

export default MenuItem;
