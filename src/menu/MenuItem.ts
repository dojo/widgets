import { assign } from '@dojo/core/lang';
import { DNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menu.css';

/**
 * @type MenuItemProperties
 *
 * Properties that can be set on a MenuItem component
 *
 * @property disabled
 * Indicates whether the menu is disabled. If true, then the widget will ignore events.
 *
 * @property external
 * Applies only when a URL is provided. If `true`, the URL will be opened in a new window.
 *
 * @property getAriaProperties
 * Returns an object of aria properties to apply to the widget's DOM element.
 *
 * @property hasMenu
 * A flag indicating whether the widget is used as the label for a menu widget. If `true`,
 * then the `menuLabel` CSS class is applied instead of the `menuItem` class.
 *
 * @property label
 * The widget text content.
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
 *
 * @property url
 * A URL to navigate to on click.
 */
export interface MenuItemProperties extends ThemeableProperties {
	disabled?: boolean;
	external?: boolean;
	getAriaProperties?: () => { [key: string]: string; };
	hasMenu?: boolean;
	label?: string;
	onClick?: (event: MouseEvent) => void;
	onKeypress?: (event: KeyboardEvent) => void;
	selected?: boolean;
	tabIndex?: number;
	url?: string;
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
			disabled,
			external,
			hasMenu = false,
			getAriaProperties,
			label,
			selected,
			tabIndex = 0,
			url
		} = this.properties;

		const ariaProperties = getAriaProperties && getAriaProperties() || Object.create(null);
		const classes = this.classes(
			hasMenu ? css.menuLabel : css.menuItem,
			disabled ? css.disabled : null,
			selected ? css.selected : null
		);

		const labelNode = v('a', assign(ariaProperties, {
			'aria-disabled': disabled,
			classes,
			href: url || undefined,
			onclick: this.onClick,
			onkeypress: this.onKeypress,
			role: 'menuitem',
			tabIndex : disabled ? -1 : tabIndex,
			target: url && external ? '_blank' : undefined
		}), label ? [ label ] : undefined);

		if (this.children.length) {
			const children: DNode[] = [ labelNode ];
			return v('span', {
				classes: this.classes(css.menuItem)
			}, children.concat(this.children));
		}

		return labelNode;
	}
}

export default MenuItem;
