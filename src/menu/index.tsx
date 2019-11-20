import { RenderResult } from '@dojo/framework/core/interfaces';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import { focus } from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { uuid } from '@dojo/framework/core/util';
import { create, renderer, tsx } from '@dojo/framework/core/vdom';
import { findIndex } from '@dojo/framework/shim/array';
import global from '@dojo/framework/shim/global';
import { Keys } from '../common/util';
import theme from '../middleware/theme';
import * as menuItemCss from '../theme/menu-item.m.css';
import * as listBoxItemCss from '../theme/list-box-item.m.css';
import * as css from '../theme/menu.m.css';
import MenuItem from './MenuItem';
import ListBoxItem from './ListBoxItem';

export type MenuOption = { value: string; label?: string; disabled?: boolean };

export interface MenuProperties {
	/** Options to display within the menu */
	options: MenuOption[];
	/** The initial selected value */
	initialValue?: string;
	/** Callback called when user selects a value */
	onValue(value: string): void;
	/** Called to request that the menu be closed */
	onRequestClose?(): void;
	/** Optional callback, when passed, the widget will no longer control it's own active index / keyboard navigation */
	onActiveIndexChange?(index: number): void;
	/** Optional proprty to set the activeIndex when it is being controlled externally */
	activeIndex?: number;
	/** Determines if the widget can be focused or not. If the active index is controlled from elsewhere you may wish to stop the menu being focused and receiving keyboard events */
	focusable?: boolean;
	/** Callback called when menu root is focused */
	onFocus?(): void;
	/** Callback called when menu root is blurred */
	onBlur?(): void;
	/** Property to determine how many items to render. Not passing a number will render all results */
	itemsInView?: number;
	/** Custom renderer for item contents */
	itemRenderer?(properties: ItemRendererProperties): RenderResult;
	/** Property to determine if this menu is being used as a listbox, changes a11y and item type */
	listBox?: boolean;
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
	idBase: string;
	initial: string;
	inputText: string;
	itemHeight: number;
	itemsInView: number;
	itemToScroll: number;
	menuHeight: number;
	resetInputTextTimer: any;
	value: string;
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

const factory = create({
	icache: createICacheMiddleware<MenuICache>(),
	focus,
	dimensions,
	theme
}).properties<MenuProperties>();

export const Menu = factory(function({
	properties,
	middleware: { icache, focus, dimensions, theme }
}) {
	const {
		activeIndex,
		focusable = true,
		initialValue,
		itemRenderer,
		itemsInView,
		listBox = false,
		onActiveIndexChange,
		onBlur,
		onFocus,
		onRequestClose,
		onValue,
		options,
		theme: themeProp
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
		icache.set('activeIndex', findIndex(options, (option) => option.value === initialValue));
	}

	if (itemsInView && itemsInView !== icache.get('itemsInView')) {
		icache.set('itemsInView', itemsInView);

		const offscreenItemProps = {
			selected: false,
			onSelect: () => {},
			active: false,
			onRequestActive: () => {},
			onActive: () => {},
			scrollIntoView: false,
			id: 'offcreen'
		};

		const menuItemChild = itemRenderer
			? itemRenderer({
					selected: false,
					active: false,
					value: 'offscreen',
					disabled: false
			  })
			: 'offscreen';

		const offscreenMenuItem = <MenuItem {...offscreenItemProps}>{menuItemChild}</MenuItem>;

		const itemHeight = icache.getOrSet('itemHeight', offscreenHeight(offscreenMenuItem));

		itemHeight && icache.set('menuHeight', itemsInView * itemHeight);
	}

	const selectedValue = icache.get('value');
	const computedActiveIndex =
		activeIndex === undefined ? icache.getOrSet('activeIndex', 0) : activeIndex;

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

	function onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				const activeItem = options[computedActiveIndex];
				!activeItem.disabled && setValue(activeItem.value);
				break;
			case Keys.Down:
				event.preventDefault();
				setActiveIndex((computedActiveIndex + 1) % options.length);
				break;
			case Keys.Up:
				event.preventDefault();
				setActiveIndex((computedActiveIndex - 1 + options.length) % options.length);
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
				setActiveIndex(options.length - 1);
				break;
			default:
				const newIndex = getComputedIndexFromInput(event.key);
				if (newIndex !== undefined) {
					setActiveIndex(newIndex);
				}
		}
	}

	function getComputedIndexFromInput(key: string) {
		const existingTimer = icache.get('resetInputTextTimer');
		let inputText = icache.getOrSet('inputText', '') + `${key}`;
		existingTimer && clearTimeout(existingTimer);

		const resetTextTimeout = setTimeout(() => {
			icache.set('inputText', '');
		}, 800);

		icache.set('resetInputTextTimer', resetTextTimeout);
		icache.set('inputText', inputText);

		return findIndex(
			options,
			({ disabled, value, label }) =>
				!disabled && (label || value).toLowerCase().indexOf(inputText.toLowerCase()) === 0
		);
	}

	function onActive(index: number, itemDimensions: DimensionResults) {
		const { position: itemPosition, size: itemSize } = itemDimensions;
		const { position: rootPosition, size: rootSize } = dimensions.get('root');
		if (itemPosition.bottom > rootPosition.bottom) {
			const numInView = Math.ceil(rootSize.height / itemSize.height);
			icache.set('itemToScroll', Math.max(index - numInView + 1, 0));
		} else if (itemPosition.top < rootPosition.top) {
			icache.set('itemToScroll', index);
		}
	}

	const itemToScroll = icache.get('itemToScroll');
	const menuHeight = icache.get('menuHeight');
	const idBase = icache.getOrSet('idBase', uuid());
	const rootStyles = menuHeight ? { maxHeight: `${menuHeight}px` } : {};
	const shouldFocus = focus.shouldFocus();
	const classes = theme.classes(css);

	return (
		<div
			key="root"
			classes={classes.menu}
			tabIndex={focusable ? 0 : -1}
			onkeydown={onKeyDown}
			focus={() => shouldFocus}
			onfocus={onFocus}
			onblur={onBlur}
			styles={rootStyles}
			role={listBox ? 'listbox' : 'menu'}
			aria-orientation="vertical"
			aria-activedescendant={`${idBase}-item-${activeIndex}`}
		>
			{options.map(({ value, label, disabled = false }, index) => {
				const selected = value === selectedValue;
				const active = index === computedActiveIndex;
				const itemProps = {
					id: `${idBase}-item-${index}`,
					key: `item-${index}`,
					onSelect: () => {
						setValue(value);
					},
					active,
					onRequestActive: () => {
						if (focus.isFocused('root') || !focusable) {
							setActiveIndex(index);
						}
					},
					onActive: (dimensions: DimensionResults) => {
						onActive(index, dimensions);
					},
					scrollIntoView: index === itemToScroll,
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

				return listBox ? (
					<ListBoxItem
						{...itemProps}
						selected={selected}
						theme={{
							...themeProp,
							'@dojo/widgets/list-box-item': theme.compose(
								listBoxItemCss,
								css,
								'item'
							)
						}}
					>
						{children}
					</ListBoxItem>
				) : (
					<MenuItem
						{...itemProps}
						theme={{
							...themeProp,
							'@dojo/widgets/menu-item': theme.compose(
								menuItemCss,
								css,
								'item'
							)
						}}
					>
						{children}
					</MenuItem>
				);
			})}
		</div>
	);
});

export default Menu;
