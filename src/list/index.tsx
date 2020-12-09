import { RenderResult } from '@dojo/framework/core/interfaces';
import { focus } from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, tsx } from '@dojo/framework/core/vdom';
import { Keys } from '../common/util';
import theme, { ThemeProperties } from '../middleware/theme';
import offscreen from '../middleware/offscreen';
import * as listItemCss from '../theme/default/list-item.m.css';
import * as menuItemCss from '../theme/default/menu-item.m.css';
import * as css from '../theme/default/list.m.css';
import * as fixedCss from './list.m.css';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import LoadingIndicator from '../loading-indicator';
import { throttle } from '@dojo/framework/core/util';
import Icon from '../icon';

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

const menuItemFactory = create({ theme }).properties<MenuItemProperties>();

export const MenuItem = menuItemFactory(function MenuItem({
	properties,
	children,
	middleware: { theme }
}) {
	const { onSelect, active = false, onRequestActive, disabled = false, widgetId } = properties();

	const themedCss = theme.classes(menuItemCss);

	function select() {
		!disabled && onSelect();
	}

	function requestActive() {
		!disabled && !active && onRequestActive();
	}

	return (
		<div
			id={widgetId}
			key="root"
			onpointermove={throttle(() => {
				requestActive();
			}, 500)}
			classes={[
				theme.variant(),
				themedCss.root,
				active && themedCss.active,
				disabled && themedCss.disabled
			]}
			onclick={() => {
				requestActive();
				select();
			}}
			role="menuitem"
			aria-disabled={disabled ? 'true' : 'false'}
		>
			{children()}
		</div>
	);
});

export interface ListItemProperties {
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
	/** Determines if this item can be reordered */
	draggable?: boolean;
	/** Determines if this item is actively being dragged */
	dragged?: boolean;
	/** Determines if this item is visually shifted down due to DnD */
	movedUp?: boolean;
	/** Determines if this item is visually shifted down due to DnD */
	movedDown?: boolean;
	/** Called when dragging begins */
	onDragStart?: (event: DragEvent) => void;
	/** Called when dragging ends */
	onDragEnd?: (event: DragEvent) => void;
	/** Called when over a dragged item */
	onDragOver?: (event: DragEvent) => void;
	/** Called when a holistic drag is complete */
	onDrop?: (event: DragEvent) => void;
	/** Determines if this item is visually collapsed during DnD */
	collapsed?: boolean;
}

const listItemFactory = create({ theme }).properties<ListItemProperties>();

export const ListItem = listItemFactory(function ListItem({
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
		widgetId,
		draggable,
		dragged,
		onDragStart,
		onDragEnd,
		onDragOver,
		onDrop,
		movedUp,
		movedDown,
		collapsed,
		theme: themeProp,
		variant
	} = properties();

	const themedCss = theme.classes(listItemCss);

	function select() {
		!disabled && onSelect();
	}

	function requestActive() {
		!disabled && !active && onRequestActive();
	}

	return (
		<div
			id={widgetId}
			key="root"
			onpointermove={throttle(() => {
				requestActive();
			}, 500)}
			classes={[
				theme.variant(),
				themedCss.root,
				selected && themedCss.selected,
				active && themedCss.active,
				disabled && themedCss.disabled,
				movedUp && themedCss.movedUp,
				movedDown && themedCss.movedDown,
				collapsed && themedCss.collapsed,
				dragged && themedCss.dragged,
				draggable && themedCss.draggable
			]}
			onclick={() => {
				requestActive();
				select();
			}}
			role="option"
			aria-disabled={disabled ? 'true' : 'false'}
			aria-selected={selected ? 'true' : 'false'}
			draggable={draggable}
			ondragenter={(event: DragEvent) => event.preventDefault()}
			ondragstart={onDragStart}
			ondragend={onDragEnd}
			ondragover={onDragOver}
			ondrop={onDrop}
			styles={{ visibility: dragged ? 'hidden' : undefined }}
		>
			{children()}
			{draggable && (
				<Icon
					type="barsIcon"
					classes={{ '@dojo/widgets/icon': { icon: [themedCss.dragIcon] } }}
					theme={themeProp}
					variant={variant}
				/>
			)}
		</div>
	);
});

export type ListOption = { value: string; label: string; disabled?: boolean; divider?: boolean };

export interface ListProperties {
	/** Determines if this list can be reordered */
	draggable?: boolean;
	/** Called when a draggable is dropped */
	onMove?: (from: number, to: number) => void;
	/** The initial selected value */
	initialValue?: string;
	/** Controlled value property */
	value?: string;
	/** Callback called when user selects a value */
	onValue(value: ListOption): void;
	/** Called to request that the menu be closed */
	onRequestClose?(): void;
	/** Optional callback, when passed, the widget will no longer control it's own active index / keyboard navigation */
	onActiveIndexChange?(index: number): void;
	/** Optional property to set the activeIndex when it is being controlled externally */
	activeIndex?: number;
	/** Determines if the widget can be focused or not. If the active index is controlled from elsewhere you may wish to stop the menu being focused and receiving keyboard events */
	focusable?: boolean;
	/** Callback called when menu root is focused */
	onFocus?(): void;
	/** Callback called when menu root is blurred */
	onBlur?(): void;
	/** Property to determine how many items to render. Not passing a number will render all results */
	itemsInView?: number;
	/** Property to determine if this list is being used as a menu, changes a11y and item type */
	menu?: boolean;
	/** The id to be applied to the root of this widget, if not passed, one will be generated for a11y reasons */
	widgetId?: string;
	/** Callback to determine if a list item is disabled. If not provided, ListOption.disabled will be used */
	disabled?: (item: ListOption) => boolean;
	/** Specifies if the list height should by fixed to the height of the items in view */
	height?: 'auto' | 'fixed';
}

export interface ListChildren {
	/** Custom renderer for item contents */
	(
		item: ItemRendererProperties,
		properties: ListItemProperties & MenuItemProperties & ThemeProperties
	): RenderResult;
}

export interface ItemRendererProperties {
	active: boolean;
	disabled: boolean;
	label: string;
	selected: boolean;
	value: string;
}

interface ListICache {
	activeIndex: number;
	dragIndex?: number;
	dragOverIndex?: number;
	initial: string;
	inputText: string;
	itemHeight: number;
	itemsInView: number;
	menuHeight: number;
	resetInputTextTimer: any;
	value: string;
	scrollTop: number;
	previousActiveIndex: number;
	requestedInputText: string;
}

const factory = create({
	icache: createICacheMiddleware<ListICache>(),
	focus,
	theme,
	offscreen,
	resource: createResourceMiddleware<ListOption>()
})
	.properties<ListProperties>()
	.children<ListChildren | undefined>();

export const List = factory(function List({
	children,
	properties,
	id,
	middleware: { icache, focus, theme, resource, offscreen }
}) {
	const { getOrRead, createOptions, find, meta, isLoading } = resource;
	const {
		activeIndex,
		focusable = true,
		initialValue,
		itemsInView = 10,
		menu = false,
		onActiveIndexChange,
		onBlur,
		onFocus,
		onRequestClose,
		onValue,
		widgetId,
		theme: themeProp,
		variant,
		resource: { template, options = createOptions(id) },
		classes,
		height = 'fixed'
	} = properties();
	const [itemRenderer] = children();

	function setActiveIndex(index: number) {
		if (onActiveIndexChange) {
			onActiveIndexChange(index);
		} else {
			icache.set('activeIndex', index);
		}
	}

	function setValue(value: ListOption) {
		icache.set('value', value.value);
		onValue(value);
	}

	function onKeyDown(event: KeyboardEvent, total: number) {
		const { disabled } = properties();

		event.stopPropagation();

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();

				if (activeItem) {
					const itemDisabled = disabled ? disabled(activeItem) : activeItem.disabled;

					if (!itemDisabled) {
						setValue(activeItem);
					}
				}
				break;
			case Keys.Down:
				event.preventDefault();
				if (event.metaKey || event.ctrlKey) {
					setActiveIndex(total - 1);
				} else {
					setActiveIndex((computedActiveIndex + 1) % total);
				}
				break;
			case Keys.Up:
				event.preventDefault();
				if (event.metaKey || event.ctrlKey) {
					setActiveIndex(0);
				} else {
					setActiveIndex((computedActiveIndex - 1 + total) % total);
				}
				break;
			case Keys.Escape:
				event.preventDefault();
				onRequestClose && onRequestClose();
				break;
			case Keys.Home:
				event.preventDefault();
				setActiveIndex(0);
				break;
			case Keys.End:
				event.preventDefault();
				setActiveIndex(total - 1);
				break;
			default:
				if (!event.metaKey && !event.ctrlKey && event.key.length === 1) {
					icache.set('resetInputTextTimer', (existingTimer) => {
						if (existingTimer) {
							clearTimeout(existingTimer);
						}
						return setTimeout(() => {
							icache.delete('inputText');
						}, 800);
					});
					icache.set('inputText', (value = '') => {
						return `${value}${event.key}`;
					});
				}
				break;
		}
	}

	function renderItems(start: number, count: number, startNode: number) {
		const renderedItems = [];
		const { size: resourceRequestSize } = options();
		const metaInfo = meta(template, options(), true);
		if (metaInfo && metaInfo.total) {
			let pages: number[] = [];
			for (let i = 0; i < Math.min(metaInfo.total - start, count); i++) {
				const index = i + startNode;
				const page = Math.floor(index / resourceRequestSize) + 1;
				if (pages.indexOf(page) === -1) {
					pages.push(page);
				}
			}
			if (!pages.length) {
				pages.push(1);
			}
			const pageItems = getOrRead(template, options({ page: pages }));
			for (let i = 0; i < Math.min(metaInfo.total - start, count); i++) {
				const index = i + startNode;
				const page = Math.floor(index / resourceRequestSize) + 1;
				const pageIndex = pages.indexOf(page);
				const indexWithinPage = index - (page - 1) * resourceRequestSize;
				const items = pageItems[pageIndex];
				if (items && items[indexWithinPage]) {
					const { value, label, disabled, divider } = items[indexWithinPage];
					renderedItems[i] = renderItem({ value, label, disabled, divider }, index);
				} else if (!items) {
					renderedItems[i] = renderPlaceholder(index);
				}
			}
		}
		return renderedItems;
	}

	function renderPlaceholder(index: number) {
		const itemProps = {
			widgetId: `${idBase}-item-${index}`,
			key: `item-${index}`,
			onSelect: () => {},
			active: false,
			onRequestActive: () => {
				setActiveIndex(index);
			},
			disabled: true,
			classes,
			variant
		};
		return menu ? (
			<MenuItem
				{...itemProps}
				theme={theme.compose(
					menuItemCss,
					css,
					'item'
				)}
			>
				<LoadingIndicator />
			</MenuItem>
		) : (
			<ListItem
				{...itemProps}
				selected={false}
				theme={theme.compose(
					listItemCss,
					css,
					'item'
				)}
				dragged={icache.get('dragIndex') === index}
				draggable={draggable}
				onDragStart={(event) => onDragStart(event, index)}
				onDragEnd={onDragEnd}
				onDragOver={(event) => onDragOver(event, index)}
				onDrop={(event) => onDrop(event, index)}
				movedUp={
					icache.get('dragOverIndex') === index &&
					icache.get('dragIndex')! < icache.get('dragOverIndex')!
				}
				movedDown={
					icache.get('dragOverIndex') === index &&
					icache.get('dragIndex')! > icache.get('dragOverIndex')!
				}
				collapsed={
					icache.get('dragIndex') === index && icache.get('dragOverIndex') !== undefined
				}
			>
				<LoadingIndicator />
			</ListItem>
		);
	}

	function onDragStart(event: DragEvent, index: number) {
		if (!draggable) {
			return;
		}
		icache.set('dragIndex', index);
		event.dataTransfer!.setData('text/plain', `${index}`);
	}

	function onDragOver(event: DragEvent, index: number) {
		const dragIndex = icache.get('dragIndex')!;
		if (!draggable || dragIndex === undefined) {
			return;
		}
		event.preventDefault();
		event.dataTransfer!.dropEffect = 'move';
		let targetIndex: number | undefined = index;
		if (event.offsetY < 10 && index === dragIndex + 1) {
			targetIndex = undefined;
		} else if (event.offsetY > itemHeight - 10 && index === dragIndex - 1) {
			targetIndex = undefined;
		}
		if (icache.get('dragOverIndex') !== targetIndex) {
			icache.set('dragOverIndex', targetIndex);
		}
	}

	function onDragEnd(event: DragEvent) {
		if (!draggable) {
			return;
		}
		event.preventDefault();
		icache.set('dragIndex', undefined);
		icache.set('dragOverIndex', undefined);
	}

	function onDrop(event: DragEvent, index: number) {
		if (!draggable) {
			return;
		}
		event.preventDefault();
		const from = event.dataTransfer && event.dataTransfer.getData('text/plain');
		if (from === null) {
			return;
		}
		setActiveIndex(index);
		onMove && onMove(parseInt(from, 10), index);
	}

	function renderItem(data: ListOption, index: number) {
		const { disabled } = properties();
		const { value, label, divider, disabled: optionDisabled = false } = data;
		const itemDisabled = disabled ? disabled(data) : optionDisabled;
		const selected = value === selectedValue;
		const active = index === computedActiveIndex;
		if (active) {
			activeItem = data;
		}
		const itemProps = {
			widgetId: `${idBase}-item-${index}`,
			key: `item-${index}`,
			onSelect: () => {
				setValue(data);
			},
			active,
			onRequestActive: () => {
				setActiveIndex(index);
			},
			disabled: itemDisabled,
			classes,
			variant
		};
		let item: RenderResult;

		if (itemRenderer) {
			item = itemRenderer(
				{
					value,
					label,
					disabled: itemDisabled,
					active,
					selected
				},
				{ ...itemProps, theme: themeProp }
			);
		} else {
			const children = label || value;
			item = menu ? (
				<MenuItem
					{...itemProps}
					theme={theme.compose(
						menuItemCss,
						css,
						'item'
					)}
				>
					{children}
				</MenuItem>
			) : (
				<ListItem
					{...itemProps}
					theme={theme.compose(
						listItemCss,
						css,
						'item'
					)}
					selected={selected}
					dragged={icache.get('dragIndex') === index}
					draggable={draggable}
					onDragStart={(event) => onDragStart(event, index)}
					onDragEnd={onDragEnd}
					onDragOver={(event) => onDragOver(event, index)}
					onDrop={(event) => onDrop(event, index)}
					movedUp={
						icache.get('dragOverIndex') === index &&
						icache.get('dragIndex')! < icache.get('dragOverIndex')!
					}
					movedDown={
						icache.get('dragOverIndex') === index &&
						icache.get('dragIndex')! > icache.get('dragOverIndex')!
					}
					collapsed={
						icache.get('dragIndex') === index &&
						icache.get('dragOverIndex') !== undefined
					}
				>
					{children}
				</ListItem>
			);
		}

		return divider ? [item, <hr classes={themedCss.divider} />] : item;
	}

	let { value: selectedValue, draggable, onMove } = properties();

	if (selectedValue === undefined) {
		if (initialValue !== undefined && initialValue !== icache.get('initial')) {
			icache.set('initial', initialValue);
			icache.set('value', initialValue);
		}

		selectedValue = icache.get('value');
	}

	if (itemsInView !== icache.get('itemsInView')) {
		icache.set('itemsInView', itemsInView);

		const offscreenItemProps = {
			selected: false,
			onSelect: () => {},
			active: false,
			onRequestActive: () => {},
			onActive: () => {},
			scrollIntoView: false,
			widgetId: 'offcreen',
			theme: themeProp
		};

		const offscreenMenuItem = itemRenderer ? (
			itemRenderer(
				{
					selected: false,
					active: false,
					value: 'offscreen',
					label: 'offscreen',
					disabled: false
				},
				offscreenItemProps
			)
		) : menu ? (
			<MenuItem {...offscreenItemProps}>offscreen</MenuItem>
		) : (
			<ListItem {...offscreenItemProps}>offscreen</ListItem>
		);

		const itemHeight = icache.getOrSet(
			'itemHeight',
			offscreen(() => offscreenMenuItem, (node) => node.getBoundingClientRect().height)
		);

		itemHeight && icache.set('menuHeight', itemsInView * itemHeight);
	}

	const menuHeight = icache.get('menuHeight');
	const idBase = widgetId || `menu-${id}`;
	let rootStyles: Partial<CSSStyleDeclaration> = {};
	if (menuHeight) {
		rootStyles =
			height === 'fixed' ? { height: `${menuHeight}px` } : { maxHeight: `${menuHeight}px` };
	}
	const shouldFocus = focus.shouldFocus();
	const themedCss = theme.classes(css);
	const itemHeight = icache.getOrSet('itemHeight', 0);
	let scrollTop = icache.getOrSet('scrollTop', 0);
	const nodePadding = Math.min(itemsInView, 20);
	const renderedItemsCount = itemsInView + 2 * nodePadding;
	let computedActiveIndex =
		activeIndex === undefined ? icache.getOrSet('activeIndex', 0) : activeIndex;
	const inputText = icache.get('inputText');
	const requestedInputText = icache.get('requestedInputText');
	if (inputText || requestedInputText) {
		const findOptions = {
			options: options(),
			start: computedActiveIndex + 1,
			type: 'start' as const,
			query: { label: inputText || requestedInputText }
		};
		if (!isLoading(template, findOptions)) {
			const foundItem = find(template, findOptions);
			if (!foundItem) {
				if (inputText && (!requestedInputText || inputText !== requestedInputText)) {
					icache.set('requestedInputText', inputText);
				} else {
					icache.delete('requestedInputText');
				}
			} else {
				icache.delete('requestedInputText');
			}
			if (foundItem && computedActiveIndex !== foundItem.index) {
				setActiveIndex(foundItem.index);
			}
		}
	}

	const previousActiveIndex = icache.get('previousActiveIndex');
	computedActiveIndex =
		activeIndex === undefined ? icache.getOrSet('activeIndex', 0) : activeIndex;
	let activeItem: ListOption | undefined = undefined;

	if (computedActiveIndex !== previousActiveIndex) {
		const visibleStartIndex = Math.floor(scrollTop / itemHeight);
		const visibleEndIndex = visibleStartIndex + itemsInView - 1;
		if (computedActiveIndex < visibleStartIndex) {
			scrollTop = computedActiveIndex * itemHeight;
		} else if (computedActiveIndex > visibleEndIndex) {
			scrollTop = Math.max(computedActiveIndex + 1 - itemsInView, 0) * itemHeight;
		}

		if (icache.get('scrollTop') !== scrollTop) {
			icache.set('scrollTop', scrollTop);
		}

		icache.set('previousActiveIndex', computedActiveIndex);
	}

	const startNode = Math.max(0, Math.floor(scrollTop / itemHeight) - nodePadding);
	const offsetY = startNode * itemHeight;

	const items = renderItems(startNode, renderedItemsCount, startNode);
	const metaInfo = meta(template, options(), true);

	const total = metaInfo && metaInfo.total ? metaInfo.total : 0;
	const totalContentHeight = total * itemHeight;

	return (
		<div
			key="root"
			classes={[theme.variant(), themedCss.root, fixedCss.root]}
			tabIndex={focusable ? 0 : -1}
			onkeydown={(e) => {
				onKeyDown(e, total);
			}}
			focus={() => shouldFocus}
			onfocus={onFocus}
			onpointerdown={focusable ? undefined : (event) => event.preventDefault()}
			onblur={onBlur}
			scrollTop={scrollTop}
			onscroll={(e) => {
				const newScrollTop = (e.target as HTMLElement).scrollTop;
				if (scrollTop !== newScrollTop) {
					icache.set('scrollTop', newScrollTop);
				}
			}}
			styles={rootStyles}
			role={menu ? 'menu' : 'listbox'}
			aria-orientation="vertical"
			aria-activedescendant={`${idBase}-item-${computedActiveIndex}`}
			id={idBase}
		>
			<div
				classes={fixedCss.wrapper}
				styles={{
					height: `${totalContentHeight}px`
				}}
				key="wrapper"
			>
				<div
					classes={fixedCss.transformer}
					styles={{
						transform: `translateY(${offsetY}px)`
					}}
					key="transformer"
				>
					{items}
				</div>
			</div>
		</div>
	);
});

export default List;
