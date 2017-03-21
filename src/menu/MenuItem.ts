import { assign } from '@dojo/core/lang';
import { HNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menu.css';

export interface MenuItemProperties extends ThemeableProperties {
	/**
	 * Indicates whether the menu is disabled. If true, then the widget will ignore events.
	 */
	disabled?: boolean;

	/**
	 * Applies only when a URL is provided. If `true`, the URL will be opened in a new window.
	 */
	external?: boolean;

	/**
	 * Returns an object of aria properties to apply to the widget's DOM element.
	 */
	getAriaProperties?: () => { [key: string]: string; };

	/**
	 * A flag indicating whether the widget is used as the label for a menu widget. If `true`,
	 * then the `menuLabel` CSS class is applied instead of the `menuItem` class.
	 */
	hasMenu?: boolean;

	/**
	 * The widget text content.
	 */
	label?: string;

	/**
	 * An event handler for click events.
	 */
	onClick?: (event: MouseEvent) => void;

	/**
	 * An event handler for keypress events.
	 */
	onKeypress?: (event: KeyboardEvent) => void;

	/**
	 * Indicates whether the widget is selected.
	 */
	selected?: boolean;

	/**
	 * The tab index. Defaults to 0, and is forced to -1 if the widget is disabled.
	 */
	tabIndex?: number;

	/**
	 * A URL to navigate to on click.
	 */
	url?: string;
}

@theme(css)
export class MenuItem extends ThemeableMixin(WidgetBase)<MenuItemProperties> {
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
			const children = this.children as HNode[];
			return v('span', {
				classes: this.classes(css.menuItem)
			}, [ labelNode ].concat(children));
		}

		return labelNode;
	}
}

export default MenuItem;
