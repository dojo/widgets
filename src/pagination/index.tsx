import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import { WNode } from '@dojo/framework/core/interfaces';
import { createResource, DataTemplate } from '@dojo/framework/core/resource';

import Icon from '../icon';
import Select, { defaultTransform } from '../select';
import { ListOption } from '../list';

import bundle from './Pagination.nls';
import * as css from '../theme/default/pagination.m.css';

function createMemoryTemplate<S = void>(): DataTemplate<S> {
	return {
		read: (_, put, get) => {
			let data: any[] = get();
			put(0, data);
			return { data, total: data.length };
		}
	};
}

const memoryTemplate = createMemoryTemplate();

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
	pageSizesData: ListOption[];
}

const icache = createICacheMiddleware<PaginationCache>();
const factory = create({ theme, icache, i18n }).properties<PaginationProperties>();

export default factory(function Pagination({ middleware: { theme, icache, i18n }, properties }) {
	const {
		initialPage,
		initialPageSize,
		onPage,
		onPageSize,
		pageSizes,
		siblingCount = 3,
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
		icache.set('pageSizesData', pageSizes.map((ps) => ({ value: ps.toString() })));
	}

	const page = icache.getOrSet('currentPage', 1);
	const pageSize = icache.getOrSet('pageSize', 10);
	const pageSizesData = icache.get('pageSizesData');

	const leading: WNode[] = [];
	const leadingCount = Math.min(siblingCount, page - 1);
	for (let i = 1; i <= leadingCount; i++) {
		const linkTo = page - i;

		leading.unshift(
			<button
				type="button"
				key={`numberedLink-${linkTo}`}
				classes={[classes.numberedLink, classes.link]}
				onclick={(e) => {
					e.stopPropagation();
					icache.set('currentPage', linkTo);
					onPage && onPage(linkTo);
				}}
			>
				{linkTo.toString()}
			</button>
		);
	}

	const trailing: WNode[] = [];
	const trailingCount = Math.min(siblingCount, total - page);
	for (let i = 1; i <= trailingCount; i++) {
		const linkTo = page + i;

		trailing.push(
			<button
				type="button"
				key={`numberedLink-${linkTo}`}
				classes={[classes.numberedLink, classes.link]}
				onclick={(e) => {
					e.stopPropagation();
					icache.set('currentPage', linkTo);
					onPage && onPage(linkTo);
				}}
			>
				{linkTo.toString()}
			</button>
		);
	}

	return (
		total > 1 && (
			<div key="root" classes={[theme.variant(), classes.root]}>
				{leadingCount && (
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
				)}
				{...leading}
				<div classes={classes.currentPage}>{page.toString()}</div>
				{...trailing}
				{trailingCount && (
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
				)}
				{pageSizesData && pageSizesData.length > 0 && (
					<div classes={classes.selectWrapper}>
						<Select
							key="page-size-select"
							transform={defaultTransform}
							initialValue={pageSize.toString()}
							resource={{
								resource: () => createResource(memoryTemplate),
								data: pageSizesData
							}}
							onValue={(value) => {
								onPageSize && onPageSize(parseInt(value, 10));
							}}
						>
							{{
								itemRenderer: (itemProps) => itemProps.value
							}}
						</Select>
					</div>
				)}
			</div>
		)
	);
});
