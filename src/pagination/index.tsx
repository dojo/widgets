import renderer, { create, tsx, diffProperty } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '../middleware/theme';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import resize from '@dojo/framework/core/middleware/resize';
import { RenderResult } from '@dojo/framework/core/interfaces';
import {
	createResourceMiddleware,
	createMemoryResourceTemplate
} from '@dojo/framework/core/middleware/resources';
import global from '@dojo/framework/shim/global';

import Icon from '../icon';
import Select from '../select';

import bundle from './nls/Pagination';
import * as css from '../theme/default/pagination.m.css';
import { ListOption } from '../list';

export interface PaginationProperties {
	/** The initial page number */
	initialPage?: number;

	/** Controlled page property */
	page?: number;

	/** The initial page size */
	initialPageSize?: number;

	/** Controlled page size property */
	pageSize?: number;

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
	fixedWidth: number;
	siblingWidth: number;
	pageSize: number;
	pageSizes: number[];
}

const pageSizesTemplate = createMemoryResourceTemplate<ListOption>();

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
const resource = createResourceMiddleware();
const factory = create({
	theme,
	icache,
	i18n,
	dimensions,
	resize,
	diffProperty,
	resource
}).properties<PaginationProperties>();

export default factory(function Pagination({
	id,
	middleware: { theme, icache, i18n, dimensions, resize, diffProperty, resource },
	properties
}) {
	diffProperty('theme', (current, next) => {
		if (current !== next) {
			icache.delete('fixedWidth', false);
			icache.delete('siblingWidth', false);
		}
	});
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

	let { page, pageSize } = properties();

	if (
		page === undefined &&
		initialPage !== undefined &&
		initialPage !== icache.get('initialPage')
	) {
		icache.set('initialPage', initialPage);
		icache.set('currentPage', initialPage);
	}

	const currentPage = page === undefined ? icache.getOrSet('currentPage', 1) : page;
	if (
		pageSize === undefined &&
		initialPageSize !== undefined &&
		initialPageSize !== icache.get('initialPageSize')
	) {
		icache.set('initialPageSize', initialPageSize);
		icache.set('pageSize', initialPageSize);
	}
	const currentPageSize = pageSize === undefined ? icache.getOrSet('pageSize', 10) : pageSize;

	if (pageSizes !== undefined && pageSizes !== icache.get('pageSizes')) {
		icache.set('pageSizes', pageSizes);
	}

	const showPrev = currentPage > 1;
	const prevLink = (
		<button
			type="button"
			key="prev"
			classes={[classes.prev, classes.link]}
			onclick={(e) => {
				e.stopPropagation();
				icache.set('currentPage', currentPage - 1);
				onPage && onPage(currentPage - 1);
			}}
		>
			<div classes={classes.icon}>
				<Icon type="leftIcon" />
			</div>
			<div classes={classes.label}>{messages.previous}</div>
		</button>
	);

	const showNext = currentPage < total;
	const nextLink = (
		<button
			type="button"
			key="next"
			classes={[classes.next, classes.link]}
			onclick={(e) => {
				e.stopPropagation();
				icache.set('currentPage', currentPage + 1);
				onPage && onPage(currentPage + 1);
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
		const fixedWidth = icache.getOrSet(
			'fixedWidth',
			getRenderedWidth(prevLink, theme.variant()) +
				getRenderedWidth(nextLink, theme.variant()) +
				getRenderedWidth(
					<div classes={classes.currentPage}>{total.toString()}</div>,
					theme.variant()
				)
		);
		const siblingWidth = icache.getOrSet(
			'siblingWidth',
			getRenderedWidth(
				<button classes={[classes.numberedLink, classes.link]}>{total.toString()}</button>,
				theme.variant()
			)
		);

		let availableSpace = (containerWidth - fixedWidth) / siblingWidth;

		const maxLeading = siblingCount ? Math.min(siblingCount, currentPage - 1) : currentPage - 1;
		const maxTrailing = siblingCount
			? Math.min(siblingCount, total - currentPage)
			: total - currentPage;

		for (let i = 1; i <= Math.max(maxLeading, maxTrailing); i++) {
			const showLeading = i <= maxLeading;
			const showTrailing = i <= maxTrailing;

			let spaceNeeded = 0;
			if (showLeading) {
				spaceNeeded++;
			}
			if (showTrailing) {
				spaceNeeded++;
			}

			if (availableSpace >= spaceNeeded) {
				const leadingPageNumber = currentPage - i;
				const trailingPageNumber = currentPage + i;

				if (showLeading) {
					leadingSiblings.unshift(
						<button
							type="button"
							key={`numberedLink-${leadingPageNumber}`}
							classes={[classes.numberedLink, classes.link]}
							onclick={(e) => {
								e.stopPropagation();
								icache.set('currentPage', leadingPageNumber);
								onPage && onPage(leadingPageNumber);
							}}
						>
							{leadingPageNumber.toString()}
						</button>
					);
				}

				if (showTrailing) {
					trailingSiblings.push(
						<button
							type="button"
							key={`numberedLink-${trailingPageNumber}`}
							classes={[classes.numberedLink, classes.link]}
							onclick={(e) => {
								e.stopPropagation();
								icache.set('currentPage', trailingPageNumber);
								onPage && onPage(trailingPageNumber);
							}}
						>
							{trailingPageNumber.toString()}
						</button>
					);
				}

				availableSpace -= spaceNeeded;
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
						{currentPage.toString()}
					</div>
					{...trailingSiblings}
					{showNext && nextLink}
				</div>
				{pageSizes && pageSizes.length > 0 && (
					<div classes={classes.selectWrapper}>
						<Select
							key="page-size-select"
							initialValue={
								pageSize === undefined ? currentPageSize.toString() : undefined
							}
							value={pageSize === undefined ? undefined : pageSize.toString()}
							resource={resource({
								template: pageSizesTemplate,
								initOptions: {
									id,
									data: pageSizes.map((ps) => ({
										value: `${ps}`,
										label: `${ps}`
									}))
								}
							})}
							onValue={(value) => {
								onPageSize && onPageSize(parseInt(value.value, 10));
							}}
						/>
					</div>
				)}
			</div>
		)
	);
});
