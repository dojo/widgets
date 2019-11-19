import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/menu-item.m.css';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { throttle } from '@dojo/framework/core/util';
import theme from '@dojo/framework/core/middleware/theme';

export interface MenuItemProperties {
	/** Callback used when the item is clicked */
	onSelect(): void;
	/** Property to set the selected state of the item */
	selected?: boolean;
	/** Property to set the active state of the item, indicates it's the current keyboard / mouse navigation target */
	active?: boolean;
	/** Callback used when the item wants to request it be made active, to example on pointer move */
	onRequestActive(): void;
	/** Callback used when an item is set to active, allows parent menu to scroll appropriate item into view */
	onActive(dimensions: DimensionResults): void;
	/** When set to true, the item will set `scrollIntoView` on it's root dom node */
	scrollIntoView?: boolean;
	/** Prpoperty to set the disabled state of the item */
	disabled?: boolean;
}

interface MenuItemICache {
	active: boolean;
}

const icache = createICacheMiddleware<MenuItemICache>();

const factory = create({ dimensions, icache, theme }).properties<MenuItemProperties>();

export const MenuItem = factory(function({
	properties,
	children,
	middleware: { dimensions, icache, theme }
}) {
	const {
		onSelect,
		selected = false,
		active = false,
		onRequestActive,
		onActive,
		scrollIntoView = false,
		disabled = false
	} = properties();

	if (icache.get('active') !== active) {
		icache.set('active', active);
		active && onActive(dimensions.get('root'));
	}

	const classes = theme.classes(css);

	return (
		<div
			key="root"
			onpointermove={throttle(() => {
				!disabled && !active && onRequestActive();
			}, 500)}
			classes={[
				classes.root,
				selected && classes.selected,
				active && classes.active,
				disabled && classes.disabled
			]}
			onpointerdown={() => {
				!disabled && onSelect();
			}}
			scrollIntoView={scrollIntoView}
			role="menuitem"
		>
			{children()}
		</div>
	);
});

export default MenuItem;
