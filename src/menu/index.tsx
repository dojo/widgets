import { create, tsx, renderer } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import { theme } from '@dojo/framework/core/middleware/theme';
import { cache } from '@dojo/framework/core/middleware/cache';
import { focus } from '@dojo/framework/core/middleware/focus';
import { Keys } from '../common/util';
import * as css from '../theme/menu.m.css';
import MenuItem from './MenuItem';
import { dimensions } from '@dojo/framework/core/middleware/dimensions';
import global from '@dojo/framework/shim/global';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { DimensionResults } from '@dojo/framework/core/meta/Dimensions';
import { findIndex } from '@dojo/framework/shim/array';

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
}

export interface ItemRendererProperties {
	value: string;
	label?: string;
	disabled: boolean;
	active: boolean;
	selected: boolean;
}

interface MenuICache {
	value: string;
	initial: string;
	activeIndex: number;
	numberInView: number;
	menuHeight: number;
	itemHeight: number;
	itemToScroll: number;
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
	cache,
	theme
}).properties<MenuProperties>();

export const Menu = factory(function({
	properties,
	middleware: { icache, cache, focus, dimensions, theme }
}) {
	const {
		options,
		initialValue,
		onValue,
		onRequestClose,
		onActiveIndexChange,
		activeIndex,
		focusable = true,
		onBlur,
		onFocus,
		itemsInView: numberInView,
		itemRenderer,
		theme: themeProp
	} = properties();

	if (initialValue !== undefined && initialValue !== icache.get('initial')) {
		icache.set('initial', initialValue);
		icache.set('value', initialValue);
		icache.set('activeIndex', findIndex(options, (option) => option.value === initialValue));
	}

	if (numberInView && numberInView !== icache.get('numberInView')) {
		icache.set('numberInView', numberInView);

		const offscreenItemProps = {
			selected: false,
			onSelect: () => {},
			active: false,
			onRequestActive: () => {},
			onActive: () => {},
			scrollIntoView: false
		};

		const itemHeight = icache.getOrSet(
			'itemHeight',
			offscreenHeight(
				<MenuItem {...offscreenItemProps}>
					{itemRenderer
						? itemRenderer({
								selected: false,
								active: false,
								value: 'offscreen',
								disabled: false
						  })
						: 'offscreen'}
				</MenuItem>
			)
		);
		itemHeight && icache.set('menuHeight', numberInView * itemHeight);
	}

	const selectedValue = icache.get('value');
	const computedActiveIndex =
		activeIndex === undefined ? icache.getOrSet('activeIndex', 0) : activeIndex;

	function _setActiveIndex(index: number) {
		if (onActiveIndexChange) {
			onActiveIndexChange(index);
		} else {
			icache.set('activeIndex', index);
		}
	}

	function _setValue(value: string) {
		icache.set('value', value);
		onValue(value);
	}

	function _onKeyDown(event: KeyboardEvent) {
		event.stopPropagation();

		switch (event.which) {
			case Keys.Enter:
			case Keys.Space:
				event.preventDefault();
				const activeItem = options[computedActiveIndex];
				!activeItem.disabled && _setValue(activeItem.value);
				break;
			case Keys.Down:
				event.preventDefault();
				_setActiveIndex((computedActiveIndex + 1) % options.length);
				break;
			case Keys.Up:
				event.preventDefault();
				_setActiveIndex((computedActiveIndex - 1 + options.length) % options.length);
				break;
			case Keys.Escape:
				event.preventDefault();
				onRequestClose && onRequestClose();
				break;
			default:
				const newIndex = getComputedIndexFromInput(event.key);
				if (newIndex !== undefined) {
					_setActiveIndex(newIndex);
				}
		}
	}

	function getComputedIndexFromInput(key: string) {
		const existingTimer = cache.get<NodeJS.Timer>('resetInputTextTimer');
		let inputText = cache.get<string>('inputText') || '';
		existingTimer && clearTimeout(existingTimer);

		cache.set(
			'resetInputTextTimer',
			setTimeout(() => {
				cache.set('inputText', '');
			}, 800)
		);

		inputText += `${key}`;
		cache.set('inputText', inputText);

		return findIndex(options, ({ disabled, value, label }, i) => {
			if (disabled) {
				return false;
			}

			if ((label || value).toLowerCase().indexOf(inputText.toLowerCase()) === 0) {
				return true;
			}

			return false;
		});
	}

	function _onActive(index: number, itemDimensions: DimensionResults) {
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
	const rootStyles = menuHeight ? { maxHeight: `${menuHeight}px` } : {};
	const shouldFocus = focus.shouldFocus();
	const classes = theme.classes(css);

	return (
		<div
			key="root"
			classes={classes.root}
			tabIndex={focusable ? 0 : -1}
			onkeydown={_onKeyDown}
			focus={() => shouldFocus}
			onfocus={onFocus}
			onblur={onBlur}
			styles={rootStyles}
		>
			{options.map(({ value, label, disabled = false }, index) => {
				const selected = value === selectedValue;
				const active = index === computedActiveIndex;
				return (
					<MenuItem
						key={`item-${index}`}
						selected={selected}
						onSelect={() => {
							_setValue(value);
						}}
						active={active}
						theme={themeProp}
						onRequestActive={() => {
							if (focus.isFocused('root') || !focusable) {
								_setActiveIndex(index);
							}
						}}
						onActive={(dimensions: DimensionResults) => {
							_onActive(index, dimensions);
						}}
						scrollIntoView={index === itemToScroll}
						disabled={disabled}
					>
						{itemRenderer
							? itemRenderer({
									value,
									label,
									disabled,
									active,
									selected
							  })
							: label || value}
					</MenuItem>
				);
			})}
		</div>
	);
});

export default Menu;
