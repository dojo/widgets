import theme from '@dojo/framework/core/middleware/theme';
import { throttle } from '@dojo/framework/core/util';
import { create, tsx } from '@dojo/framework/core/vdom';
import * as css from '../theme/default/list-box-item.m.css';

export interface ListBoxItemProperties {
	/** Callback used when the item is clicked */
	onSelect(): void;
	/** Property to set the selected state of the item */
	selected?: boolean;
	/** Property to set the active state of the item, indicates it's the current keyboard / mouse navigation target */
	active?: boolean;
	/** Callback used when the item wants to request it be made active, to example on pointer move */
	onRequestActive(): void;
	/** Property to set the disabled state of the item */
	disabled?: boolean;
	/** The id to apply to this widget top level for a11y */
	widgetId: string;
}

const factory = create({ theme }).properties<ListBoxItemProperties>();

export const ListBoxItem = factory(function ListBoxItem({
	properties,
	children,
	middleware: { theme }
}) {
	const {
		onSelect,
		active = false,
		onRequestActive,
		selected = false,
		disabled = false,
		widgetId
	} = properties();

	const classes = theme.classes(css);

	return (
		<div
			id={widgetId}
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
			role="option"
			aria-disabled={disabled}
			aria-selected={selected}
		>
			{children()}
		</div>
	);
});

export default ListBoxItem;
