import { WidgetBase } from '@dojo/framework/core/WidgetBase';
import { ThemedMixin, theme } from '@dojo/framework/core/mixins/Themed';
import { v } from '@dojo/framework/core/vdom';

import * as fixedCss from './styles/paginated-footer.m.css';
import * as css from '../theme/grid-paginated-footer.m.css';

export interface PaginatedFooterProperties {
	total?: number;
	page: number;
	pageSize: number;
	onPageChange: (page: number) => void;
}

@theme(css)
export default class PaginatedFooter extends ThemedMixin(WidgetBase)<PaginatedFooterProperties> {
	private _renderPageControl(page: number) {
		const { onPageChange, page: currentPage } = this.properties;
		const active = page === currentPage;

		return v(
			'button',
			{
				key: active ? 'current' : `${page}`,
				disabled: active,
				onclick: () => {
					onPageChange(page);
				},
				'aria-current': active ? 'page' : undefined,
				'aria-label': active ? `Current Page, Page ${page}` : `Goto Page ${page}`,
				classes: [this.theme(css.pageNumber), active && this.theme(css.active)]
			},
			[`${page}`]
		);
	}

	private _renderPaginationControls(totalPages: number) {
		const { page } = this.properties;
		if (page < 4) {
			return [
				this._renderPageControl(1),
				totalPages > 1 && this._renderPageControl(2),
				totalPages > 2 && this._renderPageControl(3),
				totalPages > 3 && this._renderPageControl(4),
				totalPages > 4 && this._renderPageControl(5),
				totalPages > 5 &&
					v(
						'span',
						{
							key: 'more',
							'aria-hidden': true,
							classes: [this.theme(css.more), fixedCss.moreFixed]
						},
						['...']
					),
				totalPages > 5 && this._renderPageControl(totalPages)
			];
		} else if (page > totalPages - 3) {
			return [
				this._renderPageControl(1),
				v(
					'span',
					{
						key: 'less',
						'aria-hidden': true,
						classes: [this.theme(css.more), fixedCss.moreFixed]
					},
					['...']
				),
				this._renderPageControl(totalPages - 4),
				this._renderPageControl(totalPages - 3),
				this._renderPageControl(totalPages - 2),
				this._renderPageControl(totalPages - 1),
				this._renderPageControl(totalPages)
			];
		} else {
			return [
				this._renderPageControl(1),
				v(
					'span',
					{
						key: 'less',
						'aria-hidden': true,
						classes: [this.theme(css.more), fixedCss.moreFixed]
					},
					['...']
				),
				this._renderPageControl(page - 1),
				this._renderPageControl(page),
				this._renderPageControl(page + 1),
				v(
					'span',
					{
						key: 'more',
						'aria-hidden': true,
						classes: [this.theme(css.more), fixedCss.moreFixed]
					},
					['...']
				),
				this._renderPageControl(totalPages)
			];
		}
	}

	protected render() {
		const { onPageChange, page, total, pageSize } = this.properties;
		if (total === undefined) {
			return null;
		}
		const totalPages = Math.ceil(total / pageSize);
		const from = page === 1 ? '1' : `${(page - 1) * pageSize + 1}`;
		const to = page === 1 ? pageSize : page * pageSize;
		const controls = total ? this._renderPaginationControls(totalPages) : [];
		return v('div', { classes: [this.theme(css.root), fixedCss.rootFixed] }, [
			v(
				'div',
				{
					classes: [
						fixedCss.containerFixed,
						this.theme(css.details),
						fixedCss.detailsFixed
					]
				},
				[total ? `${from} - ${total < to ? total : to} of ${total} Results` : '0 Results']
			),
			v(
				'nav',
				{
					role: 'navigation',
					'aria-label': 'Pagination Navigation',
					classes: [this.theme(css.pagination)]
				},
				[
					v(
						'ul',
						{
							classes: [
								fixedCss.containerFixed,
								this.theme(css.paginationList),
								fixedCss.paginationListFixed
							]
						},
						[
							v('li', { classes: [fixedCss.itemFixed, this.theme(css.item)] }, [
								totalPages > 1 &&
									v(
										'button',
										{
											key: 'previous',
											disabled: page === 1,
											onclick: () => {
												onPageChange(page - 1);
											},
											'aria-label': `Goto Page ${page - 1}`,
											classes: [
												this.theme(css.pageNav),
												fixedCss.pageNavFixed
											]
										},
										['<']
									),
								...controls,
								totalPages > 1 &&
									v(
										'button',
										{
											key: 'next',
											disabled: page === totalPages,
											onclick: () => {
												onPageChange(page + 1);
											},
											'aria-label': `Goto Page ${page + 1}`,
											classes: [
												this.theme(css.pageNav),
												fixedCss.pageNavFixed
											]
										},
										['>']
									)
							])
						]
					)
				]
			)
		]);
	}
}
