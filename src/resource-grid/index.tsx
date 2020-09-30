import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import resize from '@dojo/framework/core/middleware/resize';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import { create, renderer, tsx } from '@dojo/framework/core/vdom';
import global from '@dojo/framework/shim/global';
import theme from '../middleware/theme';
import * as fixedCss from './Grid.m.css';
import { createResourceMiddleware } from '@dojo/framework/core/middleware/resources';
import { RenderResult } from '@dojo/framework/core/interfaces';
// import LoadingIndicator from '../../loading-indicator';

export interface ColumnConfig {
	id: string;
	title: string;
	filterable?: boolean;
	sortable?: boolean;
	resizable?: boolean;
}

export interface GridProperties {
	columns: ColumnConfig[];
	/** The id to be applied to the root of this widget, if not passed, one will be generated for a11y reasons */
	widgetId?: string;
}

export interface GridChildren {
	rows?(columns: ColumnConfig[], item: any, index: number): RenderResult;
	headings?(columns: ColumnConfig): RenderResult;
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
	theme,
	resize,
	dimensions,
	resource: createResourceMiddleware<any>()
})
	.properties<GridProperties>()
	.children<GridChildren | undefined>();

export const Grid = factory(function Grid({
	children,
	properties,
	id,
	middleware: { icache, theme, resource, resize, dimensions }
}) {
	const { getOrRead, createOptions, /* find,*/ meta /*, isLoading */ } = resource;
	const {
		widgetId,
		resource: { template, options = createOptions(id) },
		columns
	} = properties();

	const [rowRenderer = defaultRowRenderer] = children();

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
			icache.set('itemHeight', itemHeight, true);
		}

		icache.set('itemsInView', Math.floor(bodyHeight / itemHeight));
	}

	const idBase = widgetId || `menu-${id}`;
	const metaInfo = meta(template, options(), true);

	if (!metaInfo || metaInfo.total === undefined) {
		return;
	}

	function renderPlaceholderRow(index: number) {
		return <div classes={fixedCss.row}>{`placeholder ${index}`}</div>;
	}

	function defaultRowRenderer(columns: ColumnConfig[], item: any, index: number) {
		return <Row columns={columns} item={item} index={index} />;
	}

	function defaultHeaderRowRenderer(columns: ColumnConfig[]) {
		return columns.map((config) => {
			return <HeaderCell />;
		});
	}

	function renderRows(start: number, count: number) {
		const renderedItems = [];
		const metaInfo = meta(template, options({ size: count }), true);
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
					renderedItems[i] = rowRenderer(columns, items[indexWithinPage], index);
				} else if (!items) {
					renderedItems[i] = renderPlaceholderRow(index);
				}
			}
		}
		return renderedItems;
	}

	const itemHeight = icache.getOrSet('itemHeight', 0);
	const scrollTop = icache.getOrSet('scrollTop', 0);
	const itemsInView = icache.getOrSet('itemsInView', 0);
	const nodePadding = Math.min(itemsInView, 20);
	const totalContentHeight = metaInfo.total * itemHeight;

	const startNode = Math.max(0, Math.floor(scrollTop / itemHeight) - nodePadding);
	const offsetY = startNode * itemHeight;
	const renderedItemsCount = itemsInView + 2 * nodePadding;

	const items = Number.isInteger(startNode) ? renderRows(startNode, renderedItemsCount) : [];

	return (
		<div key="root" classes={[theme.variant(), fixedCss.root]} role="grid" id={idBase}>
			<div role="table" classes={fixedCss.table}>
				<div role="rowgroup" key="head" classes={fixedCss.head}>
					<div role="row" classes={fixedCss.row}>
						{}
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

export interface RowProperties {
	columns: ColumnConfig[];
	item: any;
	index: number;
}

const rowFactory = create()
	.properties<RowProperties>()
	.children<RenderResult | undefined>();

export const Row = rowFactory(function Row({ children, properties, id }) {
	const { columns, item, index } = properties();
	const [...childCells] = children();
	let cells: RenderResult[];
	if (childCells && childCells.length > 0) {
		cells = childCells;
	} else {
		cells = columns.map((config) => {
			return <Cell>{`${item[config.id]}`}</Cell>;
		});
	}

	return (
		<div classes={fixedCss.row} key={`row-${index}`}>
			{cells}
		</div>
	);
});

const cellFactory = create().properties();

export const Cell = cellFactory(function Cell({ children, properties, id }) {
	return (
		<span role="cell" classes={fixedCss.td}>
			{children()}
		</span>
	);
});

const headerCellFactory = create().properties();
export const HeaderCell = headerCellFactory(function HeaderCell({ children, properties, id }) {
	return (
		<span role="columnheader" classes={[fixedCss.th, config.sortable && fixedCss.sortable]}>
			{config.title} {config.sortable && ' ^'}
		</span>
	);
});
