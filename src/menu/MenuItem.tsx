import { create, tsx } from '@dojo/framework/core/vdom';

import * as css from '../theme/menuItem.m.css';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { throttle } from '@dojo/framework/core/util';

export interface MenuItemProperties {
	onSelect(): void;
	selected?: boolean;
	active: boolean;
	onRequestActive(): void;
	onActive(dimensions: DimensionResults): void;
	scrollIntoView: boolean;
	disabled?: boolean;
}

interface MenuItemICache {
	active: boolean;
}

const icache = createICacheMiddleware<MenuItemICache>();

const factory = create({ dimensions, icache }).properties<MenuItemProperties>();

export const MenuItem = factory(function({
	properties,
	children,
	middleware: { dimensions, icache }
}) {
	const {
		onSelect,
		selected,
		active,
		onRequestActive,
		onActive,
		scrollIntoView,
		disabled
	} = properties();

	if (icache.get('active') !== active) {
		icache.set('active', active);
		active && onActive(dimensions.get('root'));
	}

	return (
		<div
			key="root"
			onpointermove={throttle(() => {
				!disabled && !active && onRequestActive();
			}, 500)}
			classes={[
				css.root,
				selected ? css.selected : null,
				active ? css.active : null,
				disabled ? css.disabled : null
			]}
			onpointerdown={() => {
				!disabled && onSelect();
			}}
			scrollIntoView={scrollIntoView}
		>
			{children()}
		</div>
	);
});

export default MenuItem;
