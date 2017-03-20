import { assign } from '@dojo/core/lang';
import { HNode } from '@dojo/widget-core/interfaces';
import { v } from '@dojo/widget-core/d';
import ThemeableMixin, { theme, ThemeableProperties } from '@dojo/widget-core/mixins/Themeable';
import WidgetBase from '@dojo/widget-core/WidgetBase';
import * as css from './styles/menu.css';

export interface MenuItemProperties extends ThemeableProperties {
	disabled?: boolean;
	external?: boolean;
	getAriaProperties?: () => { [key: string]: string; };
	hasMenu?: boolean;
	label?: string;
	onClick?: () => void;
	selected?: boolean;
	tabIndex?: number;
	url?: string;
}

@theme(css)
export class MenuItem extends ThemeableMixin(WidgetBase)<MenuItemProperties> {
	onClick() {
		const { disabled, onClick } = this.properties;
		if (!disabled && typeof onClick === 'function') {
			onClick();
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
