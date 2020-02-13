import { RenderResult } from '@dojo/framework/core/interfaces';
import { focus } from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { create, renderer, tsx } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import { Keys } from '../common/util';
import theme from '../middleware/theme';
import * as listBoxItemCss from '../theme/default/list-box-item.m.css';
import * as menuItemCss from '../theme/default/menu-item.m.css';
import * as css from '../theme/default/menu.m.css';
import * as fixedCss from './menu.m.css';
import ListBoxItem from './ListBoxItem';
import MenuItem from './MenuItem';
import { createDataMiddleware } from '../common/data';

export type MenuOption = { value: string; label?: string; disabled?: boolean; divider?: boolean };

export interface MenuProperties {
	/** Options to display within the menu. The `value` of the option will be passed to `onValue` when it is selected. The label is an optional display string to be used instead of the `value`. If `disabled` is true the option will have a disabled style and will not be selectable. An option with `divider: true` will have a divider rendered after it in the menu */
	// options: MenuOption[];
	/** The total number of options provided */
	// total: number;
	/** The initial selected value */
	initialValue?: string;
	/** Callback called when user selects a value */
	onValue(value: string): void;
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
	/** Property to determine if this menu is being used as a listbox, changes a11y and item type */
	listBox?: boolean;
	/** The id to be applied to the root of this widget, if not passed, one will be generated for a11y reasons */
	widgetId?: string;
}

export interface MenuChildren {
	/** Custom renderer for item contents */
	(properties: ItemRendererProperties): RenderResult;
}

export interface ItemRendererProperties {
	active: boolean;
	disabled: boolean;
	label?: string;
	selected: boolean;
	value: string;
}

interface MenuICache {
	activeIndex: number;
	initial: string;
	inputText: string;
	itemHeight: number;
	itemsInView: number;
	menuHeight: number;
	resetInputTextTimer: any;
	value: string;
	scrollTop: number;
	previousActiveIndex: number;
}

const offscreenHeight = (dnode: RenderResult) => {
	const r = renderer(() => dnode);
	const div = global.document.createElement('div');
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions.height;
};

const data = createDataMiddleware<MenuOption>();

const factory = create({
	icache: createICacheMiddleware<MenuICache>(),
	focus,
	theme
})
	.properties<MenuProperties>()
	.children<MenuChildren | undefined>();

export const Menu = factory(function Menu({
	children,
	properties,
	id,
	middleware: { icache, focus, theme, data }
}) {
	const {
		activeIndex,
		focusable = true,
		initialValue,
		itemsInView = 10,
		listBox = false,
		onActiveIndexChange,
		onBlur,
		onFocus,
		onRequestClose,
		onValue,
		widgetId,
		theme: themeProp
	} = properties();
	const [itemRenderer] = children();

	const { getOrRead, getOptions, setOptions, getTotal, isLoading } = data();

	function setActiveIndex(index: number) {
		if (onActiveIndexChange) {
			onActiveIndexChange(index);
		} else {
			icache.set('activeIndex', index);
		}
	}

	function setValue(value: string) {
		icache.set('value', value);
		onValue(value);
	}

	function onKeyDown(event: KeyboardEvent, total: number) {
		event.stopPropagation();

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				if (activeItem && !activeItem.disabled) {
					setValue(activeItem.value);
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
				if (event.metaKey || event.ctrlKey) {
					return;
				}
			// const newIndex = getComputedIndexFromInput(event.key);
			// if (newIndex !== undefined) {
			// 	setActiveIndex(newIndex);
			// }
		}
	}

	// function getComputedIndexFromInput(key: string) {
	// 	const existingTimer = icache.get('resetInputTextTimer');
	// 	let inputText = icache.getOrSet('inputText', '') + `${key}`;
	// 	existingTimer && clearTimeout(existingTimer);

	// 	const resetTextTimeout = setTimeout(() => {
	// 		icache.set('inputText', '');
	// 	}, 800);

	// 	icache.set('resetInputTextTimer', resetTextTimeout);
	// 	icache.set('inputText', inputText);

	// 	return findIndex(
	// 		options,
	// 		({ disabled, value, label }) =>
	// 			!disabled && (label || value).toLowerCase().indexOf(inputText.toLowerCase()) === 0
	// 	);
	// }

	function renderItems(startNode: number, count: number) {
		if (!total) {
			return [];
		}

		const renderedItemsCount = Math.min(total - startNode, count);
		const renderedItems = new Array(renderedItemsCount);
		const pages = [];
		const loading = [];
		for (let i = 0; i < renderedItemsCount; i++) {
			const index = i + startNode;
			const page = Math.floor(index / count) + 1;
			if (!pages[page]) {
				setOptions({
					...getOptions(),
					pageNumber: page
				});
				pages[page] = getOrRead(getOptions()) || [];
				loading[page] = isLoading(getOptions());
			}
			const indexWithinPage = index - (page - 1) * count;
			const menuOption = pages[page][indexWithinPage];
			const pageIsLoading = loading[page];
			renderedItems[i] = pageIsLoading
				? renderPlaceholder(index)
				: renderItem(menuOption, index);
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
			disabled: true
		};
		return listBox ? (
			<ListBoxItem
				{...itemProps}
				selected={false}
				theme={theme.compose(
					listBoxItemCss,
					css,
					'item'
				)}
			>
				LOADING
			</ListBoxItem>
		) : (
			<MenuItem
				{...itemProps}
				theme={theme.compose(
					menuItemCss,
					css,
					'item'
				)}
			>
				LOADING
			</MenuItem>
		);
	}

	function renderItem(data: MenuOption, index: number) {
		const { value, label, divider, disabled = false } = data;
		const selected = value === selectedValue;
		const active = index === computedActiveIndex;
		if (active) {
			activeItem = data;
		}
		const itemProps = {
			widgetId: `${idBase}-item-${index}`,
			key: `item-${index}`,
			onSelect: () => {
				setValue(value);
			},
			active,
			onRequestActive: () => {
				setActiveIndex(index);
			},
			disabled
		};

		const children = itemRenderer
			? itemRenderer({
					value,
					label,
					disabled,
					active,
					selected
			  })
			: label || value;

		const item = listBox ? (
			<ListBoxItem
				{...itemProps}
				selected={selected}
				theme={theme.compose(
					listBoxItemCss,
					css,
					'item'
				)}
			>
				{children}
			</ListBoxItem>
		) : (
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
		);

		return divider ? [item, <hr classes={themedCss.divider} />] : item;
	}

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
		// icache.set('activeIndex', findIndex(options, (option) => option.value === initialValue));
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

		const menuItemChild = itemRenderer
			? itemRenderer({
					selected: false,
					active: false,
					value: 'offscreen',
					disabled: false
			  })
			: 'offscreen';

		const offscreenMenuItem = listBox ? (
			<ListBoxItem {...offscreenItemProps}>{menuItemChild}</ListBoxItem>
		) : (
			<MenuItem {...offscreenItemProps}>{menuItemChild}</MenuItem>
		);

		const itemHeight = icache.getOrSet('itemHeight', offscreenHeight(offscreenMenuItem));

		itemHeight && icache.set('menuHeight', itemsInView * itemHeight);
	}

	const nodePadding = Math.min(itemsInView, 20);
	const selectedValue = icache.get('value');
	const menuHeight = icache.get('menuHeight');
	const idBase = widgetId || `menu-${id}`;
	const rootStyles = menuHeight ? { maxHeight: `${menuHeight}px` } : {};
	const shouldFocus = focus.shouldFocus();
	const themedCss = theme.classes(css);
	const itemHeight = icache.getOrSet('itemHeight', 0);
	let scrollTop = icache.getOrSet('scrollTop', 0);

	const previousActiveIndex = icache.get('previousActiveIndex');
	const computedActiveIndex =
		activeIndex === undefined ? icache.getOrSet('activeIndex', 0) : activeIndex;

	let activeItem: MenuOption | undefined = undefined;

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

	const renderedItemsCount = itemsInView + 2 * nodePadding;

	if (!getOptions().pageNumber || !getOptions().pageSize) {
		const { pageSize = renderedItemsCount, pageNumber = 1, query } = getOptions();
		setOptions({
			pageNumber,
			pageSize,
			query
		});
	}

	const total = getTotal(getOptions());

	if (total === undefined) {
		getOrRead(getOptions());
		return;
	}

	const totalContentHeight = total * itemHeight;

	return (
		<div
			key="root"
			classes={[themedCss.root, fixedCss.root]}
			tabIndex={focusable ? 0 : -1}
			onkeydown={(e) => {
				onKeyDown(e, total);
			}}
			focus={() => shouldFocus}
			onfocus={onFocus}
			onblur={onBlur}
			scrollTop={scrollTop}
			onscroll={(e) => {
				const newScrollTop = (e.target as HTMLElement).scrollTop;
				if (scrollTop !== newScrollTop) {
					icache.set('scrollTop', newScrollTop);
				}
			}}
			styles={rootStyles}
			role={listBox ? 'listbox' : 'menu'}
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
					{renderItems(startNode, renderedItemsCount)}
				</div>
			</div>
		</div>
	);
});

export default Menu;
