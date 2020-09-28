// import { RenderResult } from '@dojo/framework/core/interfaces';
import { focus } from '@dojo/framework/core/middleware/focus';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import resize from '@dojo/framework/core/middleware/resize';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import { create, renderer, tsx } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
// import { Keys } from '../../common/util';
import theme from '../middleware/theme';
import * as fixedCss from './Grid.m.css';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import { RenderResult } from '@dojo/framework/core/interfaces';
// import LoadingIndicator from '../../loading-indicator';

export interface ColumnConfig {
	id: string;
	title: string | (() => RenderResult);
	filterable?: boolean;
	sortable?: boolean;
	editable?: boolean;
	resizable?: boolean;
	renderer?: (props: any) => RenderResult;
}

export interface GridProperties {
	columns: ColumnConfig[];
	/** The initial selected value */
	initialValue?: string;
	/** Controlled value property */
	value?: string;
	/** Callback called when user selects a value */
	onValue?(value: string): void;
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
}

interface GridICache {
	itemHeight: number;
	itemsInView: number;
	scrollTop: number;
}

function offscreenHeight(dnode: RenderResult): number {
	const r = renderer(() => dnode);
	const div = global.document.createElement('div');
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions.height;
}

const factory = create({
	icache: createICacheMiddleware<GridICache>(),
	focus,
	theme,
	resize,
	dimensions,
	resource: createResourceMiddleware<any>()
}).properties<GridProperties>();

export const Grid = factory(function Grid({
	children,
	properties,
	id,
	middleware: { icache, focus, theme, resource, resize, dimensions }
}) {
	const { getOrRead, createOptions, /* find,*/ meta /*, isLoading */ } = resource;
	const {
		widgetId,
		resource: { template, options = createOptions(id) },
		columns
	} = properties();

	let bodyHeight = 0;
	const rootDimensions = resize.get('root');

	if (rootDimensions) {
		const { size: headSize } = dimensions.get('head');
		const { size: footSize } = dimensions.get('foot');
		bodyHeight = rootDimensions.height - headSize.height - footSize.height;

		let itemHeight = icache.get('itemHeight');
		if (!itemHeight) {
			const offscreenRow = (
				<div role="row" classes={fixedCss.row}>
					{columns.map((config) => {
						return <span role="cell" classes={fixedCss.td}>{`${config.id}`}</span>;
					})}
				</div>
			);
			itemHeight = offscreenHeight(offscreenRow);
			icache.set('itemHeight', itemHeight);
		}

		icache.set('itemsInView', Math.floor(bodyHeight / itemHeight));
		console.log('items in view: ', icache.get('itemsInView'));
	}

	const idBase = widgetId || `menu-${id}`;
	const metaInfo = meta(template, options(), true);

	if (!metaInfo || metaInfo.total === undefined) {
		return;
	}

	function renderRow(item: any, index: number) {
		return (
			<div classes={fixedCss.row} key={`row-${index}`}>
				{columns.map((config) => {
					return <span role="cell" classes={fixedCss.td}>{`${item[config.id]}`}</span>;
				})}
			</div>
		);
	}

	function renderPlaceholderRow(index: number) {
		return <div classes={fixedCss.row}>{`placeholder ${index}`}</div>;
	}

	function renderRows(start: number, count: number) {
		const renderedItems = [];
		const metaInfo = meta(template, options(), true);
		if (metaInfo && metaInfo.total) {
			const pages: number[] = [];
			for (let i = 0; i < Math.min(metaInfo.total - start, count); i++) {
				const index = i + startNode;
				const page = Math.floor(index / count) + 1;
				if (pages.indexOf(page) === -1) {
					pages.push(page);
				}
			}
			const pageItems = getOrRead(template, options({ page: pages }));
			for (let i = 0; i < Math.min(metaInfo.total - start, count); i++) {
				const index = i + startNode;
				const page = Math.floor(index / count) + 1;
				const pageIndex = pages.indexOf(page);
				const indexWithinPage = index - (page - 1) * count;
				const items = pageItems[pageIndex];
				if (items && items[indexWithinPage]) {
					renderedItems[i] = renderRow(items[indexWithinPage], index);
				} else if (!items) {
					renderedItems[i] = renderPlaceholderRow(index);
				}
			}
		}
		return renderedItems;
	}

	const scrollTop = icache.getOrSet('scrollTop', 0);
	const itemHeight = icache.getOrSet('itemHeight', 0);
	const itemsInView = icache.getOrSet('itemsInView', 0);
	const nodePadding = Math.min(itemsInView, 20);

	const totalContentHeight = metaInfo.total * itemHeight;

	const startNode = Math.max(0, Math.floor(scrollTop / itemHeight) - nodePadding);
	const offsetY = startNode * itemHeight;
	const renderedItemsCount = itemsInView + 2 * nodePadding;
	options({ size: renderedItemsCount });

	const items = renderRows(startNode, renderedItemsCount);

	return (
		<div key="root" classes={[theme.variant(), fixedCss.root]} role="grid" id={idBase}>
			<div role="table" classes={fixedCss.table}>
				<div role="rowgroup" key="head" classes={fixedCss.head}>
					<div role="row" classes={fixedCss.row}>
						{columns.map((config) => {
							return (
								<span role="columnheader" classes={fixedCss.th}>
									{config.title}
								</span>
							);
						})}
					</div>
				</div>
				<div
					scrollTop={scrollTop}
					onscroll={(e) => {
						const newScrollTop = (e.target as HTMLElement).scrollTop;
						if (scrollTop !== newScrollTop) {
							icache.set('scrollTop', newScrollTop);
						}
					}}
					role="rowgroup"
					key="body"
					classes={fixedCss.body}
					styles={{ height: `${bodyHeight}px` }}
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
				<div role="rowgroup" key="foot" classes={fixedCss.foot}>{`Total: ${
					metaInfo.total
				}`}</div>
			</div>
		</div>
	);
});

export default Grid;
