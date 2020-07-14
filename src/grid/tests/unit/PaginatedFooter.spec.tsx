const { describe, it } = intern.getInterface('bdd');

import harness from '@dojo/framework/testing/harness/harness';
import { v, w } from '@dojo/framework/core/vdom';
import assertionTemplate from '@dojo/framework/testing/harness/assertionTemplate';

import * as css from '../../../theme/default/grid-paginated-footer.m.css';
import * as fixedCss from '../../styles/paginated-footer.m.css';
import PaginatedFooter from '../../PaginatedFooter';
import { noop } from '../../../common/tests/support/test-helpers';

const baseTemplate = assertionTemplate(() =>
	v('div', { classes: [css.root, fixedCss.rootFixed] }, [
		v(
			'div',
			{
				'~key': 'details',
				classes: [fixedCss.containerFixed, css.details, fixedCss.detailsFixed]
			},
			['1 – 100 of 10500 Results']
		),
		v(
			'nav',
			{
				role: 'navigation',
				'aria-label': 'Pagination Navigation',
				classes: [css.pagination]
			},
			[
				v(
					'ul',
					{
						classes: [
							fixedCss.containerFixed,
							css.paginationList,
							fixedCss.paginationListFixed
						]
					},
					[
						v(
							'li',
							{ '~key': 'pagination-item', classes: [fixedCss.itemFixed, css.item] },
							[
								v(
									'button',
									{
										key: 'previous',
										disabled: true,
										onclick: noop,
										'aria-label': `Go to Page 0`,
										classes: [css.pageNav, fixedCss.pageNavFixed]
									},
									['<']
								),

								v(
									'button',
									{
										key: 'current',
										disabled: true,
										onclick: noop,
										'aria-current': 'page',
										'aria-label': 'Current Page, Page 1',
										classes: [css.pageNumber, css.active]
									},
									['1']
								),
								v(
									'button',
									{
										key: '2',
										disabled: false,
										onclick: noop,
										'aria-current': undefined,
										'aria-label': 'Go to Page 2',
										classes: [css.pageNumber, false]
									},
									['2']
								),
								v(
									'button',
									{
										key: '3',
										disabled: false,
										onclick: noop,
										'aria-current': undefined,
										'aria-label': 'Go to Page 3',
										classes: [css.pageNumber, false]
									},
									['3']
								),
								v(
									'button',
									{
										key: '4',
										disabled: false,
										onclick: noop,
										'aria-current': undefined,
										'aria-label': 'Go to Page 4',
										classes: [css.pageNumber, false]
									},
									['4']
								),
								v(
									'button',
									{
										key: '5',
										disabled: false,
										onclick: noop,
										'aria-current': undefined,
										'aria-label': 'Go to Page 5',
										classes: [css.pageNumber, false]
									},
									['5']
								),
								v(
									'span',
									{
										key: 'more',
										'aria-hidden': 'true',
										classes: [css.more, fixedCss.moreFixed]
									},
									['...']
								),
								v(
									'button',
									{
										key: '105',
										disabled: false,
										onclick: noop,
										'aria-current': undefined,
										'aria-label': 'Go to Page 105',
										classes: [css.pageNumber, false]
									},
									['105']
								),
								v(
									'button',
									{
										key: 'next',
										disabled: false,
										onclick: noop,
										'aria-label': `Go to Page 2`,
										classes: [css.pageNav, fixedCss.pageNavFixed]
									},
									['>']
								)
							]
						)
					]
				)
			]
		)
	])
);

describe('PaginatedFooter', () => {
	it('should render footer nothing without total', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 1,
				pageSize: 100,
				onPageChange: noop
			})
		);
		h.expect(() => v('div', { classes: [css.root, fixedCss.rootFixed] }));
	});

	it('should render the controls for the initial page', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 1,
				pageSize: 100,
				total: 10500,
				onPageChange: noop
			})
		);
		h.expect(baseTemplate);
	});

	it('should render the controls for the middle pages', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 12,
				pageSize: 100,
				total: 10500,
				onPageChange: noop
			})
		);
		const pageControlsTemplate = baseTemplate
			.setChildren('~details', () => ['1101 – 1200 of 10500 Results'])
			.setChildren('~pagination-item', () => {
				return [
					v(
						'button',
						{
							key: 'previous',
							disabled: false,
							onclick: noop,
							'aria-label': `Go to Page 11`,
							classes: [css.pageNav, fixedCss.pageNavFixed]
						},
						['<']
					),
					v(
						'button',
						{
							key: '1',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 1',
							classes: [css.pageNumber, false]
						},
						['1']
					),
					v(
						'span',
						{
							key: 'less',
							'aria-hidden': 'true',
							classes: [css.more, fixedCss.moreFixed]
						},
						['...']
					),
					v(
						'button',
						{
							key: '11',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 11',
							classes: [css.pageNumber, false]
						},
						['11']
					),
					v(
						'button',
						{
							key: 'current',
							disabled: true,
							onclick: noop,
							'aria-current': 'page',
							'aria-label': 'Current Page, Page 12',
							classes: [css.pageNumber, css.active]
						},
						['12']
					),
					v(
						'button',
						{
							key: '13',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 13',
							classes: [css.pageNumber, false]
						},
						['13']
					),
					v(
						'span',
						{
							key: 'more',
							'aria-hidden': 'true',
							classes: [css.more, fixedCss.moreFixed]
						},
						['...']
					),
					v(
						'button',
						{
							key: '105',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 105',
							classes: [css.pageNumber, false]
						},
						['105']
					),
					v(
						'button',
						{
							key: 'next',
							disabled: false,
							onclick: noop,
							'aria-label': `Go to Page 13`,
							classes: [css.pageNav, fixedCss.pageNavFixed]
						},
						['>']
					)
				];
			});
		h.expect(pageControlsTemplate);
	});

	it('should render the controls for the last page', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 105,
				pageSize: 100,
				total: 10500,
				onPageChange: noop
			})
		);
		const pageControlsTemplate = baseTemplate
			.setChildren('~details', () => ['10401 – 10500 of 10500 Results'])
			.setChildren('~pagination-item', () => {
				return [
					v(
						'button',
						{
							key: 'previous',
							disabled: false,
							onclick: noop,
							'aria-label': `Go to Page 104`,
							classes: [css.pageNav, fixedCss.pageNavFixed]
						},
						['<']
					),
					v(
						'button',
						{
							key: '1',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 1',
							classes: [css.pageNumber, false]
						},
						['1']
					),
					v(
						'span',
						{
							key: 'less',
							'aria-hidden': 'true',
							classes: [css.more, fixedCss.moreFixed]
						},
						['...']
					),
					v(
						'button',
						{
							key: '101',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 101',
							classes: [css.pageNumber, false]
						},
						['101']
					),
					v(
						'button',
						{
							key: '102',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 102',
							classes: [css.pageNumber, false]
						},
						['102']
					),
					v(
						'button',
						{
							key: '103',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 103',
							classes: [css.pageNumber, false]
						},
						['103']
					),
					v(
						'button',
						{
							key: '104',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 104',
							classes: [css.pageNumber, false]
						},
						['104']
					),
					v(
						'button',
						{
							key: 'current',
							disabled: true,
							onclick: noop,
							'aria-current': 'page',
							'aria-label': 'Current Page, Page 105',
							classes: [css.pageNumber, css.active]
						},
						['105']
					),
					v(
						'button',
						{
							key: 'next',
							disabled: true,
							onclick: noop,
							'aria-label': `Go to Page 106`,
							classes: [css.pageNav, fixedCss.pageNavFixed]
						},
						['>']
					)
				];
			});
		h.expect(pageControlsTemplate);
	});

	it('should render limited controls when total is less than page size', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 1,
				pageSize: 100,
				total: 90,
				onPageChange: noop
			})
		);
		const pageControlsTemplate = baseTemplate
			.setChildren('~details', () => ['1 – 90 of 90 Results'])
			.setChildren('~pagination-item', () => {
				return [
					v(
						'button',
						{
							key: 'current',
							disabled: true,
							onclick: noop,
							'aria-current': 'page',
							'aria-label': 'Current Page, Page 1',
							classes: [css.pageNumber, css.active]
						},
						['1']
					)
				];
			});
		h.expect(pageControlsTemplate);
	});

	it('should render limited controls when total is less than 6 pages', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 1,
				pageSize: 100,
				total: 401,
				onPageChange: noop
			})
		);
		const pageControlsTemplate = baseTemplate
			.setChildren('~details', () => ['1 – 100 of 401 Results'])
			.setChildren('~pagination-item', () => {
				return [
					v(
						'button',
						{
							key: 'previous',
							disabled: true,
							onclick: noop,
							'aria-label': `Go to Page 0`,
							classes: [css.pageNav, fixedCss.pageNavFixed]
						},
						['<']
					),
					v(
						'button',
						{
							key: 'current',
							disabled: true,
							onclick: noop,
							'aria-current': 'page',
							'aria-label': 'Current Page, Page 1',
							classes: [css.pageNumber, css.active]
						},
						['1']
					),
					v(
						'button',
						{
							key: '2',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 2',
							classes: [css.pageNumber, false]
						},
						['2']
					),
					v(
						'button',
						{
							key: '3',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 3',
							classes: [css.pageNumber, false]
						},
						['3']
					),
					v(
						'button',
						{
							key: '4',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 4',
							classes: [css.pageNumber, false]
						},
						['4']
					),
					v(
						'button',
						{
							key: '5',
							disabled: false,
							onclick: noop,
							'aria-current': undefined,
							'aria-label': 'Go to Page 5',
							classes: [css.pageNumber, false]
						},
						['5']
					),
					v(
						'button',
						{
							key: 'next',
							disabled: false,
							onclick: noop,
							'aria-label': `Go to Page 2`,
							classes: [css.pageNav, fixedCss.pageNavFixed]
						},
						['>']
					)
				];
			});
		h.expect(pageControlsTemplate);
	});

	it('should not render controls when there are zero results', () => {
		const h = harness(() =>
			w(PaginatedFooter, {
				page: 1,
				pageSize: 100,
				total: 0,
				onPageChange: noop
			})
		);
		const pageControlsTemplate = baseTemplate
			.setChildren('~details', () => ['0 Results'])
			.setChildren('~pagination-item', () => {
				return [];
			});
		h.expect(pageControlsTemplate);
	});
});
