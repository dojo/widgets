import renderer, { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import resize from '@dojo/framework/core/middleware/resize';
import { RenderResult, Theme, ThemeWithVariant } from '@dojo/framework/core/interfaces';
import { Resource, createResource } from '@dojo/framework/core/resource';
import global from '@dojo/framework/shim/global';

import Icon from '../icon';
import Select, { defaultTransform } from '../select';
import { ListOption } from '../list';

import bundle from './Pagination.nls';
import * as css from '../theme/default/pagination.m.css';

export interface PaginationProperties {
	/** The initial page number */
	initialPage?: number;

	/** The initial page size */
	initialPageSize?: number;

	/** Callback fired when the page number is changed */
	onPage?(page: number): void;

	/** Callback fired when the page size is changed */
	onPageSize?(pageSize: number): void;

	/** Page size options to display in the page size selector */
	pageSizes?: number[];

	/** Number of always visible page links before and after the current page. When unset, siblings will be added to consume the available space. */
	siblingCount?: number;

	/** Total number of pages */
	total: number;
}

interface PaginationCache {
	initialPage?: number;
	initialPageSize?: number;
	currentPage: number;
	nodeWidths: { prev: number; next: number; current: number; sibling: number };
	pageSize: number;
	pageSizes: number[];
	pageSizesResource: { resource: () => Resource; data: ListOption[] };
	theme?: Theme | ThemeWithVariant;
}

function createMemoryResourceWithData<S = any>(data: S[]) {
	return {
		resource: () =>
			createResource({
				read: (_, put, get) => {
					let data: any[] = get();
					put(0, data);
					return { data, total: data.length };
				}
			}),
		data
	};
}

function getRenderedWidth(dnode: RenderResult, wrapperClass?: string): number {
	if (dnode === undefined) {
		return 0;
	}

	const r = renderer(() => dnode);
	const div = global.document.createElement('div');
	div.className = wrapperClass || '';
	div.style.position = 'absolute';
	global.document.body.appendChild(div);
	r.mount({ domNode: div, sync: true });
	const dimensions = div.getBoundingClientRect();
	global.document.body.removeChild(div);
	return dimensions.width;
}

const icache = createICacheMiddleware<PaginationCache>();
const factory = create({ theme, icache, i18n, dimensions, resize }).properties<
	PaginationProperties
>();

export default factory(function Pagination({
	middleware: { theme, icache, i18n, dimensions, resize },
	properties
}) {
	resize.get('root');

	const {
		initialPage,
		initialPageSize,
		onPage,
		onPageSize,
		pageSizes,
		siblingCount,
		total
	} = properties();
	const classes = theme.classes(css);
	const { messages } = i18n.localize(bundle);

	if (initialPage !== undefined && initialPage !== icache.get('initialPage')) {
		icache.set('initialPage', initialPage);
		icache.set('currentPage', initialPage);
	}

	if (initialPageSize !== undefined && initialPageSize !== icache.get('initialPageSize')) {
		icache.set('initialPageSize', initialPageSize);
		icache.set('pageSize', initialPageSize);
	}

	if (pageSizes !== undefined && pageSizes !== icache.get('pageSizes')) {
		icache.set('pageSizes', pageSizes);
		icache.set(
			'pageSizesResource',
			createMemoryResourceWithData(pageSizes.map((ps) => ({ value: ps.toString() })))
		);
	}

	if (theme.get() !== icache.get('theme')) {
		icache.set('theme', theme.get());
		icache.delete('nodeWidths');
	}

	const page = icache.getOrSet('currentPage', 1);
	const pageSize = icache.getOrSet('pageSize', 10);
	const pageSizesResource = icache.get('pageSizesResource');

	const showPrev = page > 1;
	const prevLink = (
		<button
			type="button"
			key="prev"
			classes={[classes.prev, classes.link]}
			onclick={(e) => {
				e.stopPropagation();
				icache.set('currentPage', page - 1);
				onPage && onPage(page - 1);
			}}
		>
			<div classes={classes.icon}>
				<Icon type="leftIcon" />
			</div>
			<div classes={classes.label}>{messages.previous}</div>
		</button>
	);

	const showNext = page < total;
	const nextLink = (
		<button
			type="button"
			key="next"
			classes={[classes.next, classes.link]}
			onclick={(e) => {
				e.stopPropagation();
				icache.set('currentPage', page + 1);
				onPage && onPage(page + 1);
			}}
		>
			<div classes={classes.icon}>
				<Icon type="rightIcon" />
			</div>
			<div classes={classes.label}>{messages.next}</div>
		</button>
	);

	const leadingSiblings: RenderResult[] = [];
	const trailingSiblings: RenderResult[] = [];
	const containerWidth = dimensions.get('links').size.width;
	if (containerWidth) {
		const nodeWidths = icache.getOrSet('nodeWidths', () => ({
			prev: getRenderedWidth(prevLink, theme.variant()),
			next: getRenderedWidth(nextLink, theme.variant()),
			current: getRenderedWidth(
				<div classes={classes.currentPage}>{total.toString()}</div>,
				theme.variant()
			),
			sibling: getRenderedWidth(
				<button classes={[classes.numberedLink, classes.link]}>{total.toString()}</button>,
				theme.variant()
			)
		}));

		const maxSiblings =
			(containerWidth -
				nodeWidths.current -
				(showPrev ? nodeWidths.prev : 0) -
				(showNext ? nodeWidths.next : 0)) /
			nodeWidths.sibling;

		const maxLeading = siblingCount ? Math.min(siblingCount, page - 1) : page - 1;
		const maxTrailing = siblingCount ? Math.min(siblingCount, total - page) : total - page;
		let numSiblings = 0;

		for (let i = 1; i <= Math.max(maxLeading, maxTrailing); i++) {
			const showLeading = i <= maxLeading;
			const showTrailing = i <= maxTrailing;

			if (maxSiblings >= numSiblings + +showLeading + +showTrailing) {
				if (showLeading) {
					leadingSiblings.unshift(
						<button
							type="button"
							key={`numberedLink-${page - i}`}
							classes={[classes.numberedLink, classes.link]}
							onclick={(e) => {
								e.stopPropagation();
								icache.set('currentPage', page - i);
								onPage && onPage(page - i);
							}}
						>
							{(page - i).toString()}
						</button>
					);
					numSiblings++;
				}

				if (showTrailing) {
					trailingSiblings.push(
						<button
							type="button"
							key={`numberedLink-${page + i}`}
							classes={[classes.numberedLink, classes.link]}
							onclick={(e) => {
								e.stopPropagation();
								icache.set('currentPage', page + i);
								onPage && onPage(page + i);
							}}
						>
							{(page + i).toString()}
						</button>
					);
					numSiblings++;
				}
			} else {
				break;
			}
		}
	}

	return (
		total > 1 && (
			<div key="root" classes={[theme.variant(), classes.root]}>
				<div
					key="links"
					classes={classes.linksWrapper}
					styles={{
						opacity: containerWidth ? '1' : '0'
					}}
				>
					{showPrev && prevLink}
					{...leadingSiblings}
					<div key="current" classes={classes.currentPage}>
						{page.toString()}
					</div>
					{...trailingSiblings}
					{showNext && nextLink}
				</div>
				{pageSizes && pageSizes.length > 0 && pageSizesResource && (
					<div classes={classes.selectWrapper}>
						<Select
							key="page-size-select"
							initialValue={pageSize.toString()}
							resource={pageSizesResource}
							transform={defaultTransform}
							onValue={(value) => {
								onPageSize && onPageSize(parseInt(value, 10));
							}}
						>
							{{
								items: (itemProps) => itemProps.value
							}}
						</Select>
					</div>
				)}
			</div>
		)
	);
});
