const { describe, it } = intern.getInterface('bdd');
const { assert } = intern.getPlugin('chai');

import { stub } from 'sinon';
import harness from '@dojo/framework/testing/harness/harness';
import { tsx, v, w } from '@dojo/framework/core/vdom';
import TextInput from '../../../text-input/index';
import Icon from '../../../icon/index';

import * as css from '../../../theme/default/grid-header.m.css';
import * as fixedCss from '../../styles/header.m.css';
import Header from '../../Header';
import { ColumnConfig } from '../../interfaces';

const noop = () => {};

const columnConfig = [
	{
		id: 'title',
		title: 'Title'
	},
	{
		id: 'firstName',
		title: 'First Name'
	}
];

const advancedColumnConfig = [
	{
		id: 'title',
		title: 'Title'
	},
	{
		id: 'firstName',
		title: () => 'Custom Title',
		sortable: true,
		editable: true,
		filterable: true
	}
];

function getColumnWidths(columns: any[]): { [index: string]: number } {
	return columns.reduce(
		(widths, column) => {
			widths[column.id] = 100;
			return widths;
		},
		{} as any
	);
}

describe('Header', () => {
	it('should render basic header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				columnWidths: undefined
			})
		);
		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[v('div', {}, ['Title'])]
				),
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[v('div', {}, ['First Name'])]
				)
			])
		);
	});

	it('should render advanced header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				columnWidths: undefined
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[v('div', {}, ['Title'])]
				),
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[
						v(
							'div',
							{
								classes: [fixedCss.column, css.sortable, null, null, null],
								onclick: noop
							},
							[
								'Custom Title',
								v(
									'button',
									{
										classes: css.sort,
										onclick: noop
									},
									[
										w(Icon, {
											type: 'downIcon',
											altText: 'Sort by Custom Title',
											classes: undefined,
											theme: undefined
										})
									]
								)
							]
						),
						w(
							TextInput,
							{
								key: 'filter',
								classes: {
									'@dojo/widgets/text-input': {
										root: [css.filter],
										input: [css.filterInput],
										noLabel: [css.filterNoLabel]
									}
								},
								labelHidden: true,
								type: 'search',
								initialValue: undefined,
								onValue: noop,
								theme: undefined
							},
							[{ label: 'Filter by Custom Title' }]
						)
					]
				)
			])
		);
	});

	it('should render with asc sorted header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				sort: {
					columnId: 'firstName',
					direction: 'asc'
				},
				columnWidths: undefined
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[v('div', {}, ['Title'])]
				),
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': 'ascending'
					},
					[
						v(
							'div',
							{
								classes: [fixedCss.column, css.sortable, css.sorted, null, css.asc],
								onclick: noop
							},
							[
								'Custom Title',
								v(
									'button',
									{
										classes: css.sort,
										onclick: noop
									},
									[
										w(Icon, {
											type: 'upIcon',
											altText: 'Sort by Custom Title',
											classes: undefined,
											theme: undefined
										})
									]
								)
							]
						),
						w(
							TextInput,
							{
								key: 'filter',
								classes: {
									'@dojo/widgets/text-input': {
										root: [css.filter],
										input: [css.filterInput],
										noLabel: [css.filterNoLabel]
									}
								},
								labelHidden: true,
								type: 'search',
								initialValue: undefined,
								onValue: noop,
								theme: undefined
							},
							[{ label: 'Filter by Custom Title' }]
						)
					]
				)
			])
		);
	});

	it('should render with desc sorted header', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				sort: {
					columnId: 'firstName',
					direction: 'desc'
				},
				columnWidths: undefined
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[v('div', {}, ['Title'])]
				),
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': 'descending'
					},
					[
						v(
							'div',
							{
								classes: [
									fixedCss.column,
									css.sortable,
									css.sorted,
									css.desc,
									null
								],
								onclick: noop
							},
							[
								'Custom Title',
								v(
									'button',
									{
										classes: css.sort,
										onclick: noop
									},
									[
										w(Icon, {
											type: 'downIcon',
											altText: 'Sort by Custom Title',
											classes: undefined,
											theme: undefined
										})
									]
								)
							]
						),
						w(
							TextInput,
							{
								key: 'filter',
								classes: {
									'@dojo/widgets/text-input': {
										root: [css.filter],
										input: [css.filterInput],
										noLabel: [css.filterNoLabel]
									}
								},
								labelHidden: true,
								type: 'search',
								initialValue: undefined,
								onValue: noop,
								theme: undefined
							},
							[{ label: 'Filter by Custom Title' }]
						)
					]
				)
			])
		);
	});

	it('should render with filter value', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				filter: {
					firstName: 'my filter'
				},
				columnWidths: undefined
			})
		);

		h.expect(() =>
			v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[v('div', {}, ['Title'])]
				),
				v(
					'div',
					{
						classes: [css.cell, fixedCss.cellFixed],
						styles: {},
						role: 'columnheader',
						'aria-sort': undefined
					},
					[
						v(
							'div',
							{
								classes: [fixedCss.column, css.sortable, null, null, null],
								onclick: noop
							},
							[
								'Custom Title',
								v(
									'button',
									{
										classes: css.sort,
										onclick: noop
									},
									[
										w(Icon, {
											type: 'downIcon',
											altText: 'Sort by Custom Title',
											classes: undefined,
											theme: undefined
										})
									]
								)
							]
						),
						w(
							TextInput,
							{
								key: 'filter',
								classes: {
									'@dojo/widgets/text-input': {
										root: [css.filter],
										input: [css.filterInput],
										noLabel: [css.filterNoLabel]
									}
								},
								labelHidden: true,
								type: 'search',
								initialValue: 'my filter',
								onValue: noop,
								theme: undefined
							},
							[{ label: 'Filter by Custom Title' }]
						)
					]
				)
			])
		);
	});

	it('should call filterer on input', () => {
		const sorterStub = stub();
		const filtererStub = stub();
		const h = harness(() =>
			w(Header, {
				columnConfig: advancedColumnConfig,
				sorter: sorterStub,
				filterer: filtererStub,
				columnWidths: undefined
			})
		);

		h.trigger('@filter', 'onValue', 'trillian');
		assert.isTrue(filtererStub.calledWith('firstName', 'trillian'));
	});

	describe('sort interaction', () => {
		it('should sort desc by default', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					columnWidths: undefined
				})
			);

			h.trigger(`.${css.sort}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
			sorterStub.resetHistory();

			h.trigger(`.${css.sortable}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
		});

		it('should sort asc on if currently desc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'desc'
					},
					columnWidths: undefined
				})
			);

			h.trigger(`.${css.sort}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'asc'));
			sorterStub.resetHistory();

			h.trigger(`.${css.sortable}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'asc'));
		});

		it('should sort desc on if currently asc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'asc'
					},
					columnWidths: undefined
				})
			);

			h.trigger(`.${css.sort}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
			sorterStub.resetHistory();

			h.trigger(`.${css.sortable}`, 'onclick', {});
			assert.isTrue(sorterStub.calledWith('firstName', 'desc'));
		});

		it('should use a custom sort renderer for asc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'asc'
					},
					sortRenderer: (column: ColumnConfig, direction: any, sorter: () => void) => {
						const title =
							typeof column.title === 'string' ? column.title : column.title();
						return v('div', { key: 'sort', onclick: sorter }, [
							`custom renderer - ${direction} - ${title}`
						]);
					},
					columnWidths: undefined
				})
			);

			h.expect(() =>
				v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {},
							role: 'columnheader',
							'aria-sort': undefined
						},
						[v('div', {}, ['Title'])]
					),
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {},
							role: 'columnheader',
							'aria-sort': 'ascending'
						},
						[
							v(
								'div',
								{
									classes: [
										fixedCss.column,
										css.sortable,
										css.sorted,
										null,
										css.asc
									],
									onclick: noop
								},
								[
									'Custom Title',
									v('div', { key: 'sort', onclick: noop }, [
										'custom renderer - asc - Custom Title'
									])
								]
							),
							w(
								TextInput,
								{
									key: 'filter',
									classes: {
										'@dojo/widgets/text-input': {
											root: [css.filter],
											input: [css.filterInput],
											noLabel: [css.filterNoLabel]
										}
									},
									labelHidden: true,
									type: 'search',
									initialValue: undefined,
									onValue: noop,
									theme: undefined
								},
								[{ label: 'Filter by Custom Title' }]
							)
						]
					)
				])
			);
		});

		it('should use a custom sort renderer for desc', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					sort: {
						columnId: 'firstName',
						direction: 'desc'
					},
					sortRenderer: (column: ColumnConfig, direction: any, sorter: () => void) => {
						const title =
							typeof column.title === 'string' ? column.title : column.title();
						return v('div', { key: 'sort', onclick: sorter }, [
							`custom renderer - ${direction} - ${title}`
						]);
					},
					columnWidths: undefined
				})
			);

			h.expect(() =>
				v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {},
							role: 'columnheader',
							'aria-sort': undefined
						},
						[v('div', {}, ['Title'])]
					),
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {},
							role: 'columnheader',
							'aria-sort': 'descending'
						},
						[
							v(
								'div',
								{
									classes: [
										fixedCss.column,
										css.sortable,
										css.sorted,
										css.desc,
										null
									],
									onclick: noop
								},
								[
									'Custom Title',
									v('div', { key: 'sort', onclick: noop }, [
										'custom renderer - desc - Custom Title'
									])
								]
							),
							w(
								TextInput,
								{
									key: 'filter',
									classes: {
										'@dojo/widgets/text-input': {
											root: [css.filter],
											input: [css.filterInput],
											noLabel: [css.filterNoLabel]
										}
									},
									labelHidden: true,
									type: 'search',
									initialValue: undefined,
									onValue: noop,
									theme: undefined
								},
								[{ label: 'Filter by Custom Title' }]
							)
						]
					)
				])
			);
		});

		it('should use custom filter renderer', () => {
			const sorterStub = stub();
			const filtererStub = stub();
			const h = harness(() =>
				w(Header, {
					columnConfig: advancedColumnConfig,
					sorter: sorterStub,
					filterer: filtererStub,
					filterRenderer: (
						columnConfig: ColumnConfig,
						filterValue: string,
						doFilter: Function,
						title?: any
					) => {
						return v('div', [
							v('input', { value: filterValue, onValue: doFilter }),
							v('span', [`${title} - ${columnConfig.id}`])
						]);
					},
					columnWidths: undefined
				})
			);

			h.expect(() =>
				v('div', { classes: [css.root, fixedCss.rootFixed], role: 'row', styles: {} }, [
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {},
							role: 'columnheader',
							'aria-sort': undefined
						},
						[v('div', {}, ['Title'])]
					),
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {},
							role: 'columnheader',
							'aria-sort': undefined
						},
						[
							v(
								'div',
								{
									classes: [fixedCss.column, css.sortable, null, null, null],
									onclick: noop
								},
								[
									'Custom Title',
									v(
										'button',
										{
											classes: css.sort,
											onclick: noop
										},
										[
											w(Icon, {
												type: 'downIcon',
												altText: 'Sort by Custom Title',
												classes: undefined,
												theme: undefined
											})
										]
									)
								]
							),
							v('div', [
								v('input', { value: '', onValue: noop }),
								v('span', ['Custom Title - firstName'])
							])
						]
					)
				])
			);
		});
	});
	it('should use resizable columns', () => {
		const columnConfig = [
			{
				id: 'title',
				title: 'Title',
				resizable: true
			},
			{
				id: 'firstName',
				title: 'First Name',
				resizable: true
			}
		];

		const h = harness(() => (
			<Header
				filterer={noop}
				sorter={noop}
				columnConfig={columnConfig}
				columnWidths={getColumnWidths(columnConfig)}
			/>
		));
		h.expect(() =>
			v(
				'div',
				{
					classes: [css.root, fixedCss.rootFixed],
					role: 'row',
					styles: { width: '200px' }
				},
				[
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {
								flex: '0 1 100px'
							},
							role: 'columnheader',
							'aria-sort': undefined
						},
						[
							v('div', {}, ['Title']),
							v('span', { key: 'title-resize', classes: [fixedCss.resize] })
						]
					),
					v(
						'div',
						{
							classes: [css.cell, fixedCss.cellFixed],
							styles: {
								flex: '0 1 100px'
							},
							role: 'columnheader',
							'aria-sort': undefined
						},
						[
							v('div', {}, ['First Name']),
							v('span', { key: 'firstName-resize', classes: [fixedCss.resize] })
						]
					)
				]
			)
		);
	});
});
