import { create, tsx } from '@dojo/framework/core/vdom';
import { createICacheMiddleware } from '@dojo/framework/core/middleware/icache';
import i18n from '@dojo/framework/core/middleware/i18n';
import theme from '@dojo/framework/core/middleware/theme';
import { WNode, RenderResult } from '@dojo/framework/core/interfaces';
import { createResource, DataTemplate } from '@dojo/framework/core/resource';

import Icon from '../icon';
import Select, { defaultTransform } from '../select';

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
	onPageChange(page: number): void;

	/** Callback fired when the page size is changed */
	onPageSizeChange?(pageSize: number): void;

	/** Page size options to display in the page size selector */
	pageSizes?: number[];

	/** Custom renderer for page size selector item */
	pageSizeRenderer?(pageSize: number): RenderResult;

	/** Total number of pages */
	total: number;
}

interface PaginationCache {
	initialPage?: number;
	initialPageSize?: number;
	currentPage: number;
	pageSize: number;
}

const icache = createICacheMiddleware<PaginationCache>();
const factory = create({ theme, icache, i18n }).properties<PaginationProperties>();

const PAGE_LINKS = 3;

export default factory(function Pagination({ middleware: { theme, icache, i18n }, properties }) {
	const {
		initialPage,
		initialPageSize,
		onPageChange,
		onPageSizeChange,
		pageSizes,
		pageSizeRenderer,
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

	const page = icache.getOrSet('currentPage', 1);
	const pageSize = icache.getOrSet('pageSize', 10);

	const pageLink = function(
		page: number,
		content?: WNode | WNode[],
		extraClasses: string = classes.numberedLink
	): WNode {
		return (
			<button
				type="button"
				classes={[extraClasses, classes.link]}
				onclick={(e) => {
					e.stopPropagation();
					icache.set('currentPage', page);
					onPageChange && onPageChange(page);
				}}
			>
				{content || page.toString()}
			</button>
		);
	};

	const leading: WNode[] = [];
	const leadingCount = page > PAGE_LINKS ? PAGE_LINKS : page - 1;
	for (let i = 1; i <= leadingCount; i++) {
		leading.unshift(pageLink(page - i));
	}

	const trailing: WNode[] = [];
	const trailingCount = total - page > PAGE_LINKS ? PAGE_LINKS : total - page;
	for (let i = 1; i <= trailingCount; i++) {
		trailing.push(pageLink(page + i));
	}

	return (
		total > 1 && (
			<div key="root" classes={[theme.variant(), classes.root]}>
				{leadingCount &&
					pageLink(
						page - 1,
						[
							<div classes={classes.icon}>
								<Icon type="leftIcon" />
							</div>,
							<div classes={classes.label}>{messages.previous}</div>
						],
						classes.prev
					)}
				{...leading}
				<div classes={classes.currentPage}>{page.toString()}</div>
				{...trailing}
				{trailingCount &&
					pageLink(
						page + 1,
						[
							<div classes={classes.icon}>
								<Icon type="rightIcon" />
							</div>,
							<div classes={classes.label}>{messages.next}</div>
						],
						classes.next
					)}
				{pageSizes && pageSizes.length > 0 && (
					<div classes={classes.selectWrapper}>
						<Select
							key="page-size-select"
							transform={defaultTransform}
							initialValue={pageSize.toString()}
							resource={{
								resource: () => createResource(memoryTemplate),
								data: pageSizes.map((ps) => ({ value: ps.toString() }))
							}}
							onValue={(value) => {
								onPageSizeChange && onPageSizeChange(parseInt(value, 10));
							}}
						>
							{(itemProps) =>
								pageSizeRenderer
									? pageSizeRenderer(parseInt(itemProps.value, 10))
									: `${itemProps.value} / page`
							}
						</Select>
					</div>
				)}
			</div>
		)
	);
});
