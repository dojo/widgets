import theme from '@dojo/framework/core/middleware/theme';
import { throttle } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/menu-item.m.css';

export interface MenuItemProperties {
	/** Callback used when the item is clicked */
	onSelect(): void;
	/** Property to set the active state of the item, indicates it's the current keyboard / mouse navigation target */
	active?: boolean;
	/** Callback used when the item wants to request it be made active, to example on pointer move */
	onRequestActive(): void;
	/** Property to set the disabled state of the item */
	disabled?: boolean;
	/** The id to apply to this widget top level for a11y */
	widgetId: string;
}

const factory = create({ theme }).properties<MenuItemProperties>();

export const MenuItem = factory(function({ properties, children, middleware: { theme } }) {
	const { onSelect, active = false, onRequestActive, disabled = false, widgetId } = properties();

	const classes = theme.classes(css);

	return (
		<div
			id={widgetId}
			key="root"
			onpointermove={throttle(() => {
				!disabled && !active && onRequestActive();
			}, 500)}
			classes={[classes.root, active && classes.active, disabled && classes.disabled]}
			onpointerdown={() => {
				!disabled && onSelect();
			}}
			role="menuitem"
			aria-disabled={disabled}
		>
			{children()}
		</div>
	);
});

export default MenuItem;
