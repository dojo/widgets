import renderer, { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import dimensions from '@dojo/framework/core/middleware/dimensions';
import resize from '@dojo/framework/core/middleware/resize';
import { RenderResult } from '@dojo/framework/core/interfaces';
import { Resource } from '@dojo/framework/core/resource';
import global from '@dojo/framework/shim/global';

import Icon from '../icon';
import Select, { defaultTransform } from '../select';
import { ListOption } from '../list';

import bundle from './Pagination.nls';
import * as css from '../theme/default/pagination.m.css';
import { createMemoryResourceWithData } from '../examples/src/widgets/list/memoryTemplate';

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

	/** Number of always visible page links before and after the current page */
	siblingCount?: number;

	/** Total number of pages */
	total: number;
}

interface PaginationCache {
	initialPage?: number;
	initialPageSize?: number;
	currentPage: number;
	pageSize: number;
	pageSizes: number[];
	pageSizesResource: { resource: () => Resource; data: ListOption[] };
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

	const page = icache.getOrSet('currentPage', 1);
	const pageSize = icache.getOrSet('pageSize', 10);
	const pageSizesResource = icache.get('pageSizesResource');

	const getRenderedWidth = (dnode: RenderResult) => {
		if (dnode === undefined) {
			return 0;
		}

		const r = renderer(() => dnode);
		const div = global.document.createElement('div');
		div.className = theme.variant() || '';
		div.style.position = 'absolute';
		global.document.body.appendChild(div);
		r.mount({ domNode: div, sync: true });
		const dimensions = div.getBoundingClientRect();
		global.document.body.removeChild(div);
		return dimensions.width;
	};

	// If provided, use `siblingCount` as an upper bound for sibling links
	const leadingCount = siblingCount ? Math.min(siblingCount, page - 1) : page - 1;
	const trailingCount = siblingCount ? Math.min(siblingCount, total - page) : total - page;

	const prevLink = leadingCount ? (
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
	) : (
		undefined
	);

	const nextLink = trailingCount ? (
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
	) : (
		undefined
	);

	const leadingSiblings: RenderResult[] = [];
	const trailingSiblings: RenderResult[] = [];
	const containerWidth = dimensions.get('links').size.width;
	let containerStyles: Partial<CSSStyleDeclaration> = {
		opacity: containerWidth ? '1' : '0'
	};

	const current = (
		<div key="current" classes={classes.currentPage}>
			{page.toString()}
		</div>
	);

	let availableWidth =
		containerWidth -
		getRenderedWidth(prevLink) -
		getRenderedWidth(current) -
		getRenderedWidth(nextLink);

	for (let i = 1; i <= Math.max(leadingCount, trailingCount); i++) {
		const leadingSibling = (
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

		const trailingSibling = (
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

		let widthNeeded = 0;
		if (i <= leadingCount) {
			widthNeeded += getRenderedWidth(leadingSibling);
		}

		if (i <= trailingCount) {
			widthNeeded += getRenderedWidth(trailingSibling);
		}

		if (containerWidth === 0 || availableWidth - widthNeeded >= 0) {
			if (i <= leadingCount) {
				leadingSiblings.unshift(leadingSibling);
			}

			if (i <= trailingCount) {
				trailingSiblings.push(trailingSibling);
			}

			availableWidth -= widthNeeded;
		} else {
			break;
		}
	}

	return (
		total > 1 && (
			<div key="root" classes={[theme.variant(), classes.root]}>
				<div key="links" classes={classes.linksWrapper} styles={containerStyles}>
					{prevLink}
					{...leadingSiblings}
					{current}
					{...trailingSiblings}
					{nextLink}
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
